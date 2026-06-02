const asyncHandler = require("../utils/asyncHandler");
const { researchWeb } = require("../utils/research");
const { calculateGpaFromCourses } = require("../utils/gpa");

function buildAnswerFromResearch(question, research) {
  const topSource = research.sources[0];
  const sourceNote = topSource?.url
    ? `\n\nSource: ${topSource.title || topSource.url} (${topSource.url})`
    : "";

  if (!research.enabled) {
    return {
      answer: `You asked: "${question}".\n\nI can answer directly, but web research is currently disabled. Add TAVILY_API_KEY in your backend .env to enable live research.`,
      sources: [],
    };
  }

  return {
    answer: `${research.summary}${sourceNote}`,
    sources: research.sources,
  };
}

exports.askAssistant = asyncHandler(async (req, res) => {
  const { question, doResearch = true } = req.body || {};

  if (!question || !String(question).trim()) {
    return res.status(400).json({
      success: false,
      message: "question is required",
    });
  }

  const normalizedQuestion = String(question).trim();
  const research = doResearch
    ? await researchWeb(normalizedQuestion)
    : { enabled: false, summary: "", sources: [] };

  const response = buildAnswerFromResearch(normalizedQuestion, research);

  res.json({
    success: true,
    data: {
      question: normalizedQuestion,
      answer: response.answer,
      didResearch: !!doResearch,
      sources: response.sources,
    },
  });
});

exports.calculateGpa = asyncHandler(async (req, res) => {
  const { courses = [], scale = 5 } = req.body || {};

  if (!Array.isArray(courses) || courses.length === 0) {
    return res.status(400).json({
      success: false,
      message: "courses must be a non-empty array",
    });
  }

  const result = calculateGpaFromCourses({ courses, scale });

  if (result.totals.countedCourses === 0) {
    return res.status(400).json({
      success: false,
      message:
        "No valid courses were found. Ensure each course has units and grade (or score).",
      data: result,
    });
  }

  res.json({
    success: true,
    data: result,
  });
});

