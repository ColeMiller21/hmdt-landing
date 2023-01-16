import React, { useEffect, useState } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { FaMinus, FaPlus } from "react-icons/fa";

const FAQ = () => {
  const hiddenTexts = [
    {
      question: "🔥 (8 spots) Bidding:",
      answer:
        "Top8 bidders will be chosen in this cycle once the bid is concluded. Their balance will be reduced by a certain amount of $HP, where the exact amount is defined as the lowest bidding amount of $HP among these Top8 holders.",
    },
    {
      question: "🔥 (6 spots) All-holder raffle:",
      answer:
        "All the holders will have the equal probability to get selected once their $HP exceeds the threshold (this threshold will be lower than HP median/mean over the entire holder distributing), in order to cover most of our holders. Threshold $HP will be deducted from the balance of raffle winners.",
    },
    {
      question: "🔥 (2 spots) Activator raffle:",
      answer:
        "The most active HMDT holders on Twitter/DC will be added to the activator list. 1-2 activators will be raffled as selected holders for each Debog cycle.",
    },
  ];

  return (
    <section id="faqs" className="flex flex-col">
      <div className="flex flex-col items-center w-full my-[2rem] ">
        <header className="mb-[3rem] flex flex-col items-center justify-center">
          <h2 className="font-pixel text-[4vw] md:text-[2vw] my-[1.75rem] text-center">
            FAQs{" "}
          </h2>
          <div className="text-[.9rem] md:text-[1rem] font-vcr text-white text-center w-[85%] md:w-[60%]">
            <p className="my-[1rem]">
              For detailed explanation, check the{" "}
              <motion.a
                href="https://hmdt.gitbook.io/helpmedebugthis-roadmap/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="gitbook link"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="underline"
              >
                <i>GitBook</i>
              </motion.a>
            </p>
            <p>
              Holders can use their $HP to bid on positions in the upcoming
              Debog cycle. Three ways to get selected (all the selected holders
              will be determined prior to each Debog Cycle):
            </p>
          </div>
        </header>
        <div className="flex justify-center w-full">
          <Accordion faqQuestions={hiddenTexts} />
        </div>
      </div>
    </section>
  );
};

export default FAQ;

const Accordion = ({ faqQuestions }) => {
  return (
    <div className={` w-full flex flex-col items-center`}>
      {faqQuestions.map((question, i) => (
        <AccordionItemMotion
          key={`${question}-${i}`}
          question={question.question}
          answer={question.answer}
          idx={i}
          questionsLength={faqQuestions?.length}
        />
      ))}
    </div>
  );
};

const AccordionItemMotion = ({ question, answer, idx, questionsLength }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      className={` w-[90%] md:w-[70%] border-t border-white ${
        idx == questionsLength - 1 ? "border-b" : ""
      } py-[1rem]`}
    >
      <AnimatePresence>
        <motion.div
          key="question"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex py-[1rem] text-[.9rem] md:text-[1rem] font-vcr text-white"
        >
          <span className="w-[10%]  mr-[5px]">{idx + 1}</span>
          <span className="w-full">{question}</span>
          <span className="w-[5%] ml-[5px] cursor-pointer flex my-auto h-full">
            {isOpen ? <FaMinus /> : <FaPlus />}
          </span>
        </motion.div>

        {isOpen && (
          <motion.div
            key="answer"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
              transition: {
                duration: 0.5,
              },
            }}
            exit={{ opacity: 0, transition: { duration: 0.4 } }}
            className="py-[1rem] w-full flex font-vcr"
          >
            <span className="w-[10%] mr-[5px]"></span>
            <span className="w-full text-[.95rem]">{answer}</span>
            <span className="w-[5%] ml-[5px]"></span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
