import React, { useState, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { chatSession } from "@/utils/AiModel";
import TextToSpeech from "@/components/TextToSpeech";
import axios from "axios";
import { 
  BookOpen, 
  FileText, 
  UploadCloud, 
  RefreshCw, 
  Layers, 
  Volume2, 
  PlusCircle, 
  Book, 
  BarChart4 
} from "lucide-react";

interface ResearchPaperResult {
  Summary: string;
  KeyTerms: string[];
  RiskAssessment: string;
  NegotiationPoints: string[];
}

interface ComparisonResult {
  criteria: string;
  ratings: { [key: number]: string | number };
  notes: string;
}

interface ResearchPaper {
  title: string | null;
  summary: string | null;
  link: string | null;
}

interface Toast {
  id: string;
  title: string;
  description: string;
  variant: "destructive" | "default";
}

const ResearchPaperAnalyzer = () => {
  const [file, setFile] = useState<File | null>(null);
  const [results, setResults] = useState<ResearchPaperResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [comparing, setComparing] = useState(false);
  const [regenerationsLeft, setRegenerationsLeft] = useState(3);
  const [paperText, setPaperText] = useState<string>("");
  const [activeResultIndex, setActiveResultIndex] = useState<number | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonResults, setComparisonResults] = useState<ComparisonResult[]>([]);
  const [savedPapers, setSavedPapers] = useState<ResearchPaper[]>([]);
  const [showLearningPath, setShowLearningPath] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const addToast = (toast: Toast) => {
    setToasts((prev) => [...prev, toast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== toast.id));
    }, 3000);
  };

  const showToast = ({
    title,
    description,
    variant,
  }: {
    title: string;
    description: string;
    variant: "destructive" | "default";
  }) => {
    addToast({ id: Date.now().toString(), title, description, variant });
  };

  const extractTextFromFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("pdf", file);

    // const response = await fetch("http://localhost:10000/extract-pdf", {
    //   method: "POST",
    //   body: formData,
    // });
     const response = await fetch("https://barclays-1.onrender.com/extract-pdf", {
      method: "POST",
      body: formData,
    });


    if (!response.ok) {
      throw new Error("Failed to process the file");
    }

    const data = await response.json();
    return data.text;
  };

  const analyzeResearchPaper = async (text: string) => {
    setLoading(true);
    try {
      const prompt = `You are a financial analyst specializing in investment agreements. Analyze the provided term sheet text and return your findings in strictly valid JSON format:
      {
        "Summary": "a concise summary of the term sheet",
        "KeyTerms": ["key terms, numeric terms and conditions outlined in the term sheet"],
        "RiskAssessment": "detailed analysis of potential risks and implications",
        "NegotiationPoints": ["Top 3-5 key points that may require further negotiation or clarification"]
      }
      Term Sheet Text: ${text}
      Ensure your response is ONLY the JSON object, with no additional text or markdown.`;
  
      const response = await chatSession.sendMessage(prompt);
      const resultText = await response.response.text();
  
      const jsonMatch = resultText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("Invalid response format");
      }
  
      const parsedResult = JSON.parse(jsonMatch[0]);
  
      if (
        !parsedResult.Summary ||
        !Array.isArray(parsedResult.KeyTerms) ||
        !parsedResult.RiskAssessment ||
        !Array.isArray(parsedResult.NegotiationPoints)
      ) {
        console.log("Invalid response:", parsedResult);
        throw new Error("Invalid response structure");
      }
  
      const newResults = [...results, parsedResult];
      setResults(newResults);
      setActiveResultIndex(newResults.length - 1);
      setShowComparison(false);
    } catch (error) {
      console.error("Error analyzing term sheet:", error);
      showToast({
        title: "Analysis Error",
        description: "An error occurred while analyzing the term sheet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      showToast({
        title: "No file selected",
        description: "Please upload a research paper (PDF, Word, or TXT file)",
        variant: "destructive",
      });
      return;
    }

    try {
      setResults([]);
      setRegenerationsLeft(3);
      setActiveResultIndex(null);
      setShowComparison(false);
      setComparisonResults([]);

      const extractedText = await extractTextFromFile(file);
      setPaperText(extractedText);
      await analyzeResearchPaper(extractedText);
    } catch (error) {
      console.error("Error extracting text:", error);
      showToast({
        title: "Processing Error",
        description: "An error occurred while processing the file. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRegenerate = async () => {
    if (regenerationsLeft <= 0) {
      showToast({
        title: "Limit Reached",
        description: "You have used all your regenerations.",
        variant: "destructive",
      });
      return;
    }

    if (!paperText) {
      showToast({
        title: "Missing Content",
        description: "No paper text available for regeneration.",
        variant: "destructive",
      });
      return;
    }

    setRegenerationsLeft((prev) => prev - 1);
    await analyzeResearchPaper(paperText);
  };

  const toggleResult = (index: number) => {
    setActiveResultIndex(index);
    setShowComparison(false);
  };

  const compareAnalyses = async () => {
    if (results.length < 2) {
      showToast({
        title: "Not Enough Analyses",
        description: "Need at least 2 analyses to compare.",
        variant: "destructive",
      });
      return;
    }

    setComparing(true);
    try {
      const analysesForComparison = results.map((result, index) => ({
        id: index + 1,
        summary: result.Summary,
        keyPoints: result.KeyTerms,
        topics: result.NegotiationPoints,
      }));

      const prompt = `Compare these ${results.length} analyses of the same research paper. Evaluate their relative quality, 
      focusing on comprehensiveness, accuracy of key points captured, and usefulness of extracted topics.
      Return your analysis ONLY as a valid JSON object with this format:
      [
        {
          "criteria": "Comprehensiveness of Summary",
          "ratings": {${analysesForComparison
            .map((a) => `"${a.id}": "rating out of 10"`)
            .join(", ")}},
          "notes": "Which analysis has the most comprehensive summary and why"
        },
        {
          "criteria": "Quality of Key Points",
          "ratings": {${analysesForComparison
            .map((a) => `"${a.id}": "rating out of 10"`)
            .join(", ")}},
          "notes": "Which analysis captured the most relevant key points"
        },
        {
          "criteria": "Usefulness of Topics",
          "ratings": {${analysesForComparison
            .map((a) => `"${a.id}": "rating out of 10"`)
            .join(", ")}},
          "notes": "Which analysis extracted the most useful research topics"
        },
        {
          "criteria": "Overall Quality",
          "ratings": {${analysesForComparison
            .map((a) => `"${a.id}": "rating out of 10"`)
            .join(", ")}},
          "notes": "Final assessment of which analysis is most accurate and useful overall"
        }
      ]
      
      Here are the analyses to compare:
      ${JSON.stringify(analysesForComparison)}`;

      const response = await chatSession.sendMessage(prompt);
      const resultText = await response.response.text();

      const jsonMatch = resultText.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error("Invalid comparison format");
      }

      const parsedComparison = JSON.parse(jsonMatch[0]);
      setComparisonResults(parsedComparison);
      setShowComparison(true);
      setActiveResultIndex(null);
    } catch (error) {
      console.error("Error comparing analyses:", error);
      showToast({
        title: "Comparison Error",
        description: "An error occurred while comparing the analyses. Please try again.",
        variant: "destructive",
      });
    } finally {
      setComparing(false);
    }
  };

  const getCombinedText = (result: ResearchPaperResult) => {
    return `Summary: ${result.Summary}. 
            Key Terms: ${result.KeyTerms.join(". ")}. 
            Risk Assessment: ${result.RiskAssessment}
            Negotiation Points: ${result.NegotiationPoints.join(". ")}`;
  };

  const addToLearningPath = (paper: ResearchPaper) => {
    if (savedPapers.some((p) => p.title === paper.title)) {
      showToast({
        title: "Already Added",
        description: "This paper is already in your learning path.",
        variant: "default",
      });
      return;
    }

    setSavedPapers([...savedPapers, paper]);
    showToast({
      title: "Paper Added",
      description: "Research paper added to your learning path!",
      variant: "default",
    });
  };

  const removeFromLearningPath = (paperTitle: string | null) => {
    if (!paperTitle) return;

    setSavedPapers(savedPapers.filter((p) => p.title !== paperTitle));
    showToast({
      title: "Paper Removed",
      description: "Research paper removed from your learning path.",
      variant: "default",
    });
  };

  return (
    <div className="min-h-screen bg-black px-4 py-10 relative">
      <div className="fixed top-5 right-5 space-y-3 z-50">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`p-4 rounded shadow-lg text-white transition transform hover:scale-105 ${
              toast.variant === "destructive" ? "bg-red-500" : "bg-green-500"
            }`}
          >
            <strong className="block">{toast.title}</strong>
            <span className="block text-sm">{toast.description}</span>
          </div>
        ))}
      </div>

      <Card className="w-full max-w-5xl mx-auto shadow-2xl rounded-2xl overflow-hidden backdrop-blur-sm bg-white/80 border-0">
        <CardHeader className="bg-gradient-to-r from-indigo-700 to-purple-700 text-white p-8">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="h-10 w-10 mr-3" />
            <CardTitle className="text-3xl font-bold">Term Sheet Analyzer</CardTitle>
          </div>
          <p className="text-center text-white/90 max-w-xl mx-auto">
            Upload a term sheet to analyze its content and extract key topics.
          </p>
        </CardHeader>

        <CardContent className="p-8 space-y-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-600" />
                <h3 className="text-lg font-semibold text-gray-800">Upload Your Term Sheet</h3>
              </div>

              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-indigo-500 transition-all"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
                <UploadCloud className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-600 mb-2">
                  {file ? file.name : "Drag and drop your file here or click to browse"}
                </p>
                <p className="text-sm text-gray-500">Supported formats: PDF, Word, TXT</p>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white transition-all"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Analyzing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Layers className="h-4 w-4" />
                    Analyze Term Sheet
                  </span>
                )}
              </Button>
            </div>
          </div>

          {results.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              <Button
                onClick={handleRegenerate}
                disabled={loading || regenerationsLeft <= 0 || comparing}
                className="bg-emerald-600 hover:bg-emerald-700 text-white transition-all"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Regenerating...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Regenerate Analysis ({regenerationsLeft} left)
                  </span>
                )}
              </Button>

              {results.length >= 2 && (
                <Button
                  onClick={compareAnalyses}
                  disabled={comparing || loading}
                  className="bg-violet-600 hover:bg-violet-700 text-white transition-all"
                >
                  {comparing ? (
                    <span className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Comparing...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <BarChart4 className="h-4 w-4" />
                      Compare All Analyses
                    </span>
                  )}
                </Button>
              )}

              {showComparison && (
                <Button
                  onClick={() => {
                    setShowComparison(false);
                    setActiveResultIndex(results.length - 1);
                  }}
                  variant="outline"
                  className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                >
                  Back to Individual View
                </Button>
              )}
            </div>
          )}

          {results.length > 0 && !showComparison && (
            <div className="mt-6 space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <Layers className="h-5 w-5 text-indigo-600" />
                <h3 className="text-lg font-semibold text-gray-800">Analysis Results</h3>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {results.map((_, index) => (
                  <Button
                    key={index}
                    onClick={() => toggleResult(index)}
                    variant={activeResultIndex === index ? "default" : "outline"}
                    className={
                      activeResultIndex === index
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                        : "border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                    }
                  >
                    Analysis {index + 1} {index === results.length - 1 ? "(Latest)" : ""}
                  </Button>
                ))}
              </div>

              {activeResultIndex !== null && results[activeResultIndex] && (
                <div className="space-y-6 rounded-xl overflow-hidden bg-white border border-gray-100 shadow-md">
                  <div className="p-6 bg-gradient-to-r from-indigo-50 to-gray-50">
                    <h3 className="text-base font-semibold text-indigo-700 mb-2">Summary</h3>
                    <p className="text-lg text-gray-800 leading-relaxed">
                      {results[activeResultIndex].Summary}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                    <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
                      <h3 className="text-base font-semibold text-indigo-700 mb-2">Key Terms</h3>
                      <ul className="space-y-2">
                        {results[activeResultIndex].KeyTerms.map((term, termIndex) => (
                          <li key={termIndex} className="flex gap-2 text-gray-700">
                            <span className="text-indigo-500 font-bold">•</span>
                            <span>{term}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
                      <h3 className="text-base font-semibold text-indigo-700 mb-2">Negotiation Points</h3>
                      <ul className="space-y-2">
                        {results[activeResultIndex].NegotiationPoints.map((point, pointIndex) => (
                          <li key={pointIndex} className="flex gap-2 text-gray-700">
                            <span className="text-indigo-500 font-bold">•</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm mx-4 mb-4">
                    <h3 className="text-base font-semibold text-indigo-700 mb-2">Risk Assessment</h3>
                    <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                      {results[activeResultIndex].RiskAssessment}
                    </p>
                  </div>

                  <div className="px-6 pb-6 flex justify-end">
                    <TextToSpeech text={getCombinedText(results[activeResultIndex])} />
                  </div>
                </div>
              )}
            </div>
          )}

          {showComparison && comparisonResults.length > 0 && (
            <div className="mt-6 space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <BarChart4 className="h-5 w-5 text-indigo-600" />
                <h3 className="text-lg font-semibold text-gray-800">Analysis Comparison</h3>
              </div>

              <div className="overflow-x-auto bg-white rounded-xl border border-gray-100 shadow-md">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Criteria
                      </th>
                      {results.map((_, index) => (
                        <th
                          key={index}
                          className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Analysis {index + 1}
                        </th>
                      ))}
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Notes
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {comparisonResults.map((comparison, index) => (
                      <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <td className="py-4 px-4 text-sm font-medium text-gray-900">
                          {comparison.criteria}
                        </td>
                        {results.map((_, analysisIndex) => {
                          const rating = comparison.ratings[analysisIndex + 1];
                          const numericRating =
                            typeof rating === "number"
                              ? rating
                              : parseFloat(
                                  String(rating).match(/\d+(\.\d+)?/)?.[0] || "0"
                                );

                          let ratingColor = "text-gray-800";
                          if (numericRating >= 8)
                            ratingColor = "text-emerald-600 font-bold";
                          else if (numericRating >= 6)
                            ratingColor = "text-indigo-600";
                          else if (numericRating < 5) ratingColor = "text-red-600";

                          return (
                            <td key={analysisIndex} className={`py-4 px-4 text-center ${ratingColor}`}>
                              {rating}
                            </td>
                          );
                        })}
                        <td className="py-4 px-4 text-sm text-gray-700">{comparison.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
                <h4 className="font-semibold text-indigo-700 mb-2">Recommendation</h4>
                <p className="text-gray-700">
                  Based on the comparison,{" "}
                  <span className="font-bold text-indigo-700">
                    Analysis{" "}
                    {Object.entries(
                      comparisonResults.find(
                        (c) => c.criteria === "Overall Quality"
                      )?.ratings || {}
                    )
                      .sort(
                        (a, b) =>
                          (typeof b[1] === "number"
                            ? b[1]
                            : parseFloat(
                                String(b[1]).match(/\d+(\.\d+)?/)?.[0] || "0"
                              )) -
                          (typeof a[1] === "number"
                            ? a[1]
                            : parseFloat(
                                String(a[1]).match(/\d+(\.\d+)?/)?.[0] || "0"
                              ))
                      )
                      .map(([key]) => key)[0]}
                  </span>{" "}
                  appears to be the most accurate and comprehensive analysis.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResearchPaperAnalyzer;