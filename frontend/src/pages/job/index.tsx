import SearchClient from "@/components/client/search.client"
import { Col, Divider, Row } from "antd"
import styles from "styles/client.module.scss"
import JobCard from "@/components/client/card/job.card"

const ClientJobPage = (props: any) => {
    return (
        <div className={styles["container"]}>
            <Row>
                <Col className="w-full">
                    <SearchClient />
                </Col>
                <Divider />
                <Col>
                    <JobCard showPagination={true} />
                </Col>
            </Row>
        </div>
    )
}

export default ClientJobPage
