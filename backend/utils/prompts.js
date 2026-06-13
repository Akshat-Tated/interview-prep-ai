const generateQuestionAnswerPrompt = (
  role,
  experience,
  topicsToFocus,
  numberOfQuestions,
) => {
  const experienceLevel =
    experience <= 2 ? "Junior" : experience <= 5 ? "Mid-Level" : "Senior"

  const difficultyDistribution =
    experience <= 2
      ? "70% Easy, 30% Medium"
      : experience <= 5
        ? "40% Easy, 50% Medium, 10% Hard"
        : "20% Easy, 50% Medium, 30% Hard"

  return `
===========================================
TECHNICAL INTERVIEW QUESTION GENERATOR
===========================================

ROLE: ${role}
EXPERIENCE: ${experience} years (${experienceLevel} Level)
TOPICS: ${topicsToFocus}
NUMBER OF QUESTIONS: ${numberOfQuestions}
DIFFICULTY DISTRIBUTION: ${difficultyDistribution}

===========================================
TASK
===========================================
Generate ${numberOfQuestions} technical interview questions for a ${role} 
position with ${experience} years of experience, focusing on:
${topicsToFocus}

===========================================
REQUIREMENTS
===========================================
1. Each question must include:
   - Clear question text
   - Detailed answer with explanation
   - Difficulty level
   - Relevant topic
   - 2-3 follow-up questions

2. Question Types to Include:
   ${
     experience <= 2
       ? "- Core fundamentals and syntax\n   - Basic algorithms and data structures\n   - Simple debugging scenarios"
       : experience <= 5
         ? "- System design components\n   - Optimization problems\n   - Architecture decisions\n   - Trade-off analysis"
         : "- Scalability challenges\n   - Distributed systems\n   - Performance optimization\n   - Technical leadership scenarios"
   }

3. Answer Format:
   - Start with a brief summary
   - Provide detailed explanation
   - Include code examples where applicable
   - Mention trade-offs and alternatives
   - Highlight best practices

===========================================
OUTPUT FORMAT (JSON)
===========================================
[
{
"question": "Full question text here?",
"answer": "Detailed, step-by-step answer here.",
"difficulty": "Easy | Medium | Hard",
"topic": "The specific topic from the provided topics list",
"followUp": ["Follow-up question 1?", "Follow-up question 2?"]
}
]

===========================================
SPECIAL INSTRUCTIONS FOR ${experienceLevel} LEVEL
===========================================
${
  experienceLevel === "Junior"
    ? "- Focus on fundamentals and clean code\n- Test understanding of core concepts\n- Include basic problem-solving questions\n- Avoid complex system design"
    : experienceLevel === "Mid-Level"
      ? "- Balance fundamentals with practical experience\n- Include optimization and refactoring questions\n- Test debugging and troubleshooting skills\n- Add moderate system design components"
      : "- Focus on architecture and scalability\n- Include leadership and decision-making scenarios\n- Test mentoring and code review abilities\n- Add complex system design with trade-offs"
}

Generate ${numberOfQuestions} high-quality technical interview questions following all specifications above.


Important: 
-Only return valid JSON
-Do NOT add any extra text outside the JSON array
-The "difficulty" field must be exactly one of: "Easy", "Medium", or "Hard"
-The "followUp" field must contain 2-3 follow-up questions as an array of strings
===========================================
`
}

const conceptExplainPrompt = (question) => {
  return `Task: Explain the technical concept or answer of the question in a clear, beginner-friendly way.
    
Question/Concept: ${question}

Instructions:
Provide a detailed, step-by-step explanation of the given technical concept or question answer.

Critical Output Requirements:
- ONLY return valid JSON
- Do NOT add any extra text, comments, or markdown outside the JSON array
- The response must start with "[" and end with "]"
- Ensure all JSON is properly escaped and valid

Output Format:
[
  {
    "title": "The full question or concept text",
    "explanation": "Detailed, step-by-step answer with clear explanation, examples, and key points."
  }
]

Guidelines for the Explanation:

1. **Title Field:**
   - Include the complete question or concept text
   - Make it descriptive and clear
   - Format as a proper question or concept statement

2. **Explanation Field Requirements:**
   - Start with a brief overview (1-2 sentences)
   - Break down the concept into logical steps
   - Use clear, beginner-friendly language
   - Include examples where applicable
   - Highlight key terms using **double asterisks**
   - Use bullet points or numbered lists within the explanation
   - End with a summary or key takeaway

3. **Explanation Structure:**
   - **Definition**: One-sentence definition
   - **Step-by-Step**: Numbered steps explaining how it works
   - **Example**: Practical example with code if applicable
   - **Key Points**: Bullet points of important takeaways
   - **Common Pitfalls**: What beginners often get wrong

4. **Formatting within Explanation String:**
   - Use \n for line breaks
   - Use **text** for bold
   - Use - for bullet points
   - Use 1., 2., 3. for numbered lists
   - Escape any double quotes with \"

Example Output:
[
  {
    "title": "What is an array and how does it work?",
    "explanation": "**Definition**: An array is a data structure that stores a collection of elements in contiguous memory locations.\n\n**How It Works**:\n1. Arrays use zero-based indexing (first element is at position 0)\n2. Elements are stored sequentially in memory\n3. Access time is O(1) because the computer calculates the exact memory location\n\n**Example**:\nconst fruits = ['apple', 'banana', 'orange'];\nconsole.log(fruits[0]); // Outputs: 'apple'\n\n**Key Takeaways**:\n- Arrays are ideal for ordered collections\n- Fast access by position\n- Fixed size in some languages, dynamic in others"
  }
]

Generate ONLY the JSON array now. Do not include any text outside the JSON structure:`
}


const evaluateAnswerPrompt = (question, referenceAnswer, userAnswer) => {
  return `
=============================================
INTERVIEW ANSWER EVALUATOR
=============================================

QUESTION: ${question}

REFERENCE ANSWER (for comparison):
${referenceAnswer}

CANDIDATE'S ANSWER (to evaluate):
${userAnswer}

=============================================
TASK
=============================================
You are a senior technical interviewer. Evaluate the candidate's
answer by comparing it against the reference answer.

Assess on these dimensions:
- Technical accuracy
- Completeness (did they cover all key points?)
- Clarity and communication
- Use of examples or code
- Depth of understanding

=============================================
SCORING RUBRIC
=============================================
10:  Exceptional — exceeds the reference answer in depth or insight
8-9: Strong — covers all key points with good depth and clarity
6-7: Adequate — covers most key points but has minor gaps
4-5: Below Average — significant gaps, inaccuracies, or lacks depth
2-3: Poor — largely incorrect, incomplete, or off-topic
0-1: No meaningful answer or completely wrong

=============================================
OUTPUT FORMAT (JSON)
=============================================
{
  "score": <integer 0-10>,
  "strengths": ["strength 1", "strength 2"],
  "weaknesses": ["weakness 1", "weakness 2"],
  "idealAnswer": "A comprehensive model answer with markdown formatting..."
}

=============================================
RULES
=============================================
- Return ONLY valid JSON, no extra text outside the JSON object
- "score" must be an integer between 0 and 10
- "strengths" must have 1 to 5 items
- "weaknesses" must have 1 to 5 items
- "idealAnswer" must be detailed, use markdown formatting (bold, lists, code blocks)
- Be constructive in weaknesses — explain what was missing and why it matters
- If the candidate's answer is better than the reference, acknowledge it
=============================================
`
}

module.exports = { generateQuestionAnswerPrompt, conceptExplainPrompt, evaluateAnswerPrompt }