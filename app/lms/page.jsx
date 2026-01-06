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
    <div className="w-full min-h-screen text-white">

      <div
        className="
          grid grid-cols-1 gap-4
          sm:grid-cols-2 sm:grid-rows-5
          lg:grid-cols-4 lg:grid-rows-5
        "
      >

        {/* 🎥 VIDEO PLAYER */}
        <div
          className="
            sm:col-span-2
            lg:col-span-3
            lg:row-span-4
            rounded-2xl
            p-3 sm:p-4
            bg-black/20
            backdrop-blur
            shadow-lg
            mx-2 lg:mx-4
          "
        >

          {/* Mobile current class title */}
          <div className="lg:hidden mb-2 text-sm text-white/80 truncate">
            ▶ {currentVideoTitle}
          </div>

          <VideoPlayer link={currentVideo} />
        </div>

        {/* 📚 PLAYLIST / ACCORDION */}
        <div
          className="
            lg:col-start-4
            lg:row-span-5
            rounded-2xl
            bg-white/10
            backdrop-blur
            overflow-y-auto
            p-3
            mx-2 lg:mx-0
            mt-6 lg:mt-0
            shadow-lg
          "
        >

          <h1 className="mb-3 text-base font-semibold text-white/90">
            📚 All Classes
          </h1>

          <Accordion variant="splitted">

            {Data.content.map((cls, clsIndex) => (
              <AccordionItem
                key={clsIndex}
                title={cls.class}
                aria-label={cls.class}
              >

                {/* SUBJECT LEVEL */}
                <Accordion variant="shadow">

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
                            className={`
                              justify-start
                              text-left
                              rounded-lg
                              py-3
                              ${currentVideo === lesson.youtubeLink
                                ? "bg-blue-500/20 text-blue-400"
                                : "bg-white/5 text-white/80"
                              }
                            `}
                            onPress={() => {
                              setCurrentVideo(lesson.youtubeLink)
                              setCurrentVideoTitle(lesson.name)
                            }}
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

        {/* 📝 NOTES SECTION */}
        <div
          className="
            sm:col-span-2
            lg:col-span-3
            lg:row-start-5
            rounded-2xl
            mx-2 lg:mx-4
            bg-white/10
            backdrop-blur
            mb-3
            p-4
            shadow-lg
          "
        >

          <h2 className="text-sm font-medium mb-2 text-white/90">
            📝 Notes — {currentVideoTitle}
          </h2>

          <textarea
            className="
              w-full
              h-28
              bg-black/20
              border border-white/20
              rounded-lg
              p-3
              text-sm
              resize-none
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
            "
            placeholder="Write your notes here..."
          />

        </div>

      </div>
    </div>
  )
}

export default LMS
