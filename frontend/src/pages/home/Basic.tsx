import React from "react"
import Joyride, { CallBackProps, STATUS, Step } from "react-joyride"
import { useMount, useSetState } from "react-use"
import { Button, Divider, Typography, Layout, FloatButton, Tooltip } from "antd"

const { Title, Paragraph } = Typography
const { Content } = Layout

interface Props {
    breakpoint: string
}

interface State {
    run: boolean
    steps: Step[]
}

function Section({
    children,
    style,
    className,
}: {
    children: React.ReactNode
    style?: React.CSSProperties
    className?: string
}) {
    return (
        <div
            className={className}
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                color: "#fff",
                ...style,
            }}
        >
            {children}
        </div>
    )
}

function BasicDemo(props: Props) {
    const { breakpoint } = props
    const [{ run, steps }, setState] = useSetState<State>({
        run: false,
        steps: [
            {
                content: <h2>Chào mừng bạn đến với NiceJob</h2>,
                locale: { skip: <strong aria-label="skip">Thoát</strong> },
                placement: "center",
                target: "body",
            },
            {
                content: (
                    <h2>
                        Đây là nơi tìm kiếm công việc theo các kỹ năng và địa
                        điểm tùy nhu cầu của bạn muốn tìm kiếm
                    </h2>
                ),
                spotlightPadding: 20,
                target: ".search-client",
                title: "Hướng dẫn sử dụng",
            },
            {
                content: "Một số công ty nổi tiếng đang sử dụng NiceJob",
                placement: "top",
                styles: {
                    options: {
                        width: 300,
                    },
                },
                target: ".multiple-company-top",
                title: "Hướng dẫn sử dụng",
            },
            {
                content: <div>Nhấn vào đây để xem tất cả các công ty</div>,
                placement: "top",
                target: ".button-all-link",
                title: "Hướng dẫn sử dụng",
            },
            {
                content: <div>Nhấn chuột vào đây để xem chi tiết công ty</div>,
                placement: "left",
                target: ".card-detail",
                title: "Hướng dẫn sử dụng",
            },
            {
                content: <h2>Đây là nơi hiển thị một số công việc hấp dẫn</h2>,
                placement: "left",
                target: ".multiple-job-top",
                title: "Hướng dẫn sử dụng",
            },
            {
                content: <div>Nhấn vào đây để xem tất cả các công việc</div>,
                placement: "top",
                target: ".button-all-link-job",
                title: "Hướng dẫn sử dụng",
            },
            {
                content: (
                    <div>Nhấn chuột vào đây để xem chi tiết công việc</div>
                ),
                placement: "left",
                target: ".card-detail-job",
                title: "Hướng dẫn sử dụng",
            },
            {
                content: (
                    <h2>
                        Cảm ơn bạn đã theo dõi chúc bạn có trải nghiệm tốt tại
                        NiceJob
                    </h2>
                ),
                placement: "center",
                target: "body",
            },
        ],
    })

    useMount(() => {
        // Accessibility checker can be added here if necessary
    })

    const handleClickStart = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault()
        setState({ run: true })
    }

    const handleJoyrideCallback = (data: CallBackProps) => {
        const { status, type } = data
        const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED]

        if (finishedStatuses.includes(status)) {
            setState({ run: false })
        }

        console.log(type, data)
    }

    return (
        <>
            <Joyride
                callback={handleJoyrideCallback}
                continuous
                run={run}
                scrollOffset={64}
                scrollToFirstStep
                showProgress
                showSkipButton
                steps={steps}
                styles={{
                    options: {
                        zIndex: 10000,
                    },
                }}
                locale={{
                    next: "Tiếp tục", // Thay đổi chữ "Next" thành "Tiếp tục"
                    back: "Quay lại", // Nếu cần, bạn cũng có thể thay đổi chữ "Back"
                    skip: "Bỏ qua",
                    last: "Kết thúc",
                    nextLabelWithProgress: "Tiếp tục (Bước {step} của {steps})",
                }}
            />

            <Tooltip title="Hướng dẫn sử dụng">
                {" "}
                <FloatButton onClick={handleClickStart} />
            </Tooltip>
        </>
    )
}
export default BasicDemo
