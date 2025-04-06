import React, { useState } from "react";
import toast from "react-hot-toast";

const questions = [
  {
    question: "How many hours can you spend with the pet daily?",
    options: [
      { answer: "Less than 1 hour", score: 0 },
      { answer: "1-3 hours", score: 1 },
      { answer: "More than 3 hours", score: 2 },
    ],
  },
  {
    question: "Do you have experience with pets?",
    options: [
      { answer: "No", score: 0 },
      { answer: "Some", score: 1 },
      { answer: "Yes, a lot", score: 2 },
    ],
  },
  {
    question: "Do you have space for a pet at home?",
    options: [
      { answer: "No", score: 0 },
      { answer: "Yes, a little", score: 1 },
      { answer: "Yes, ample space", score: 2 },
    ],
  },
  {
    question: "Can you afford pet food and healthcare?",
    options: [
      { answer: "Not really", score: 0 },
      { answer: "Somewhat", score: 1 },
      { answer: "Absolutely", score: 2 },
    ],
  },
];

const PetAdoptionForm = () => {
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [score, setScore] = useState(null);
  const [isValid, setIsValid] = useState(null);

  const handleOptionChange = (questionIndex, optionScore) => {
    const updatedAnswers = [...answers];
    updatedAnswers[questionIndex] = optionScore;
    setAnswers(updatedAnswers);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const totalScore = answers.reduce((acc, val) => acc + (val ?? 0), 0);
    setScore(totalScore);
    setIsValid(totalScore > 6);
  };

  return (
    <div className="container min-h-dvh pt-5">
        <div className="max-w-lg mx-auto mt-10 p-6 border rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">🐶 Pet Adoption Eligibility Test</h2>
        <h3 className="font-inter text-orange-600 mb-1">If Your Score is more than 6 your valid for adopt the pet</h3>
        <form onSubmit={handleSubmit}>
            {questions.map((q, index) => (
            <div key={index} className="mb-4">
                <p className="font-semibold">{index + 1}. {q.question}</p>
                {q.options.map((option, i) => (
                <label key={i} className="block">
                    <input
                    type="radio"
                    name={`question-${index}`}
                    value={option.score}
                    onChange={() => handleOptionChange(index, option.score)}
                    className="mr-2"
                    />
                    {option.answer}
                </label>
                ))}
            </div>
            ))}
            <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
            >
            Submit
            </button>
        </form>

        {score !== null && (
            <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <p>Total Score: <strong>{score}</strong></p>
            <p>Status:{" "}
                <strong className={isValid ? "text-green-600" : "text-red-600"}>
                {isValid ? toast.success("Valid for Adoption ✅") : toast.error("Not Valid for Adoption ❌")}
                </strong>
            </p>
            </div>
        )}
        </div>
    </div>
  );
};

export default PetAdoptionForm;
