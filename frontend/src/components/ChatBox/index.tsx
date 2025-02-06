// import "@/component/AI/AI.css"
const title = "Hello I am Hung'AI, Can I help you?"
import AppChat from "./AppChat"
import { useState } from "react"
import { FloatButton } from "antd"
import { QuestionCircleOutlined } from "@ant-design/icons"

const words = title.split(" ").map((word) => {
    return {
        text: word,
        className: "text-sm ",
    }
})
const AI = () => {
    const [open, setOpen] = useState<boolean>(false)
    return (
        <div>
            <FloatButton
                icon={<QuestionCircleOutlined />}
                onClick={(e) => {
                    setOpen(true)
                }}
            />
            {open && <AppChat setOpen={setOpen} />}
        </div>
    )
}

export default AI
