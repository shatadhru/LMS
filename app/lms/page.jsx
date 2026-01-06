"use client"
import React, { useState } from "react"
import VideoPlayer from "../../components/LMS/VideoPlayer"
import { Accordion, AccordionItem } from "@heroui/accordion"
import { Button } from "@heroui/button"
import Data from "../../DemoData/DemoData.json"

function LMS() {

  const [currentVideo, setCurrentVideo] = useState(
    Data.content[0].subjects[0].classes[0].youtubeLink
  )
  const [currentVideoTitle, setCurrentVideoTitle] = useState(
    Data.content[0].subjects[0].classes[0].name
  )

  return (
    <div>
      <div
        className="grid grid-cols-1 gap-4
        sm:grid-cols-2 sm:grid-rows-5
        lg:grid-cols-4 lg:grid-rows-5"
      >

        {/* 🎥 Video Player */}
        <div className="sm:col-span-2 lg:col-span-3 lg:row-span-4 rounded-2xl p-4 bg-black/10">
          <VideoPlayer link={currentVideo} />
        </div>

        {/* 📚 LMS Accordion */}
        <div className="lg:col-start-4 lg:row-span-5 rounded-xl bg-white/10 overflow-y-auto p-2  mx-2 lg:mx-0 mt-10">
       
       <h1 className="m-2">All Clases</h1>
       
          <Accordion variant="splitted">

            {Data.content.map((cls, clsIndex) => (
              <AccordionItem
                key={clsIndex}
                title={cls.class}
                aria-label={cls.class}
              >

                {/* SUBJECT LEVEL */}
                <Accordion variant="shadow" className="">
                  {cls.subjects.map((sub, subIndex) => (
                    <AccordionItem
                      key={subIndex}
                      title={sub.subject}
                      aria-label={sub.subject}
                    >

                      {/* CLASS BUTTONS */}
                      <div className="flex flex-col gap-2">
                        {sub.classes.map((lesson, lessonIndex) => (
                          <Button
                            key={lessonIndex}
                            variant="flat"
                            size="md"
                            className="justify-start"
                            onPress={() =>
                              setCurrentVideo(lesson.youtubeLink)  &&   setCurrentVideoTitle(lesson.name)
                            }
                          >
                            ▶ {lesson.name}
                          </Button>
                        ))}
                      </div>

                    </AccordionItem>
                  ))}
                </Accordion>

              </AccordionItem>
            ))}

          </Accordion>
        </div>

        {/* 📝 Notes */}
        <div className="sm:col-span-2 lg:col-span-3 lg:row-start-5 min-h-[140px] rounded-xl mx-2 lg:mx-4 bg-white/10 mb-2 p-4">
          <h2 className="text-lg font-semibold mb-2">Class :  {currentVideoTitle}</h2>
          <textarea
            className="w-full h-24 bg-transparent border border-white/20 rounded-md p-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Write your notes here..."
          ></textarea>
        </div>

      </div>
    </div>
  )
}

export default LMS
