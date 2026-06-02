async function researchWeb(query) {
  if (!process.env.TAVILY_API_KEY) {
    return {
      enabled: false,
      summary:
        "Web research is disabled because TAVILY_API_KEY is not configured.",
      sources: [],
    };
  }

  try {
    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_key: process.env.TAVILY_API_KEY,
        query,
        search_depth: "basic",
        max_results: 5,
        include_answer: true,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      return {
        enabled: true,
        summary: `Research request failed (${response.status}): ${text}`,
        sources: [],
      };
    }

    const data = await response.json();
    const sources = Array.isArray(data.results)
      ? data.results.map((r) => ({
          title: r.title,
          url: r.url,
          snippet: r.content,
        }))
      : [];

    return {
      enabled: true,
      summary:
        data.answer ||
        (sources.length
          ? "I found sources but no direct summarized answer."
          : "No research results found."),
      sources,
    };
  } catch (error) {
    return {
      enabled: true,
      summary: `Research error: ${error.message}`,
      sources: [],
    };
  }
}

module.exports = {
  researchWeb,
};

