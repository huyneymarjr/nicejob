import { Divider, FloatButton } from "antd"
import styles from "styles/client.module.scss"
import SearchClient from "@/components/client/search.client"
import JobCard from "@/components/client/card/job.card"
import CompanyCard from "@/components/client/card/company.card"
import BasicDemo from "./Basic"
import { useEffect, useRef, useState } from "react"
import ChatBot from "@/components/ChatBox"
import { useAppSelector } from "@/redux/hooks"

const HomePage = () => {
    // const user = useAppSelector((state) => state.account.user)
    // console.log("user", user)
    const [breakpoint, setBreakpoint] = useState(getScreenSize())
    const debounceTimeout = useRef(0)

    const handleResize = useRef(() => {
        clearTimeout(debounceTimeout.current)

        debounceTimeout.current = window.setTimeout(() => {
            setBreakpoint(getScreenSize())
        }, 250)
    })

    useEffect(() => {
        const { current } = handleResize

        window.addEventListener("resize", current)

        return () => {
            window.removeEventListener("resize", current)
        }
    })
    return (
        <div className={styles["container"]} style={{ marginBottom: 100 }}>
            <FloatButton.Group>
                <ChatBot />
                <BasicDemo breakpoint={breakpoint} />
            </FloatButton.Group>
            <div className="search-client">
                <SearchClient />
            </div>
            <Divider />
            <div className="multiple-company-top">
                <CompanyCard />
            </div>
            <Divider />
            <div className="multiple-job-top">
                <JobCard />
            </div>
        </div>
    )
}
export function getScreenSize() {
    const { innerWidth } = window
    let breakpoint = "xs"

    if (innerWidth >= 1024) {
        breakpoint = "lg"
    } else if (innerWidth >= 768) {
        breakpoint = "md"
    } else if (innerWidth >= 400) {
        breakpoint = "sm"
    }

    return breakpoint
}
export default HomePage
