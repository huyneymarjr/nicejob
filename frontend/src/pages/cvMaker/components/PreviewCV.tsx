import React, { useState } from "react";
import styles from "styles/cv-theme.module.scss";
import {
  QuestionCircleOutlined,
  MailOutlined,
  PhoneOutlined,
  CalculatorOutlined,
  EnvironmentFilled,
} from "@ant-design/icons";
import cvmale from "@/assets/Images/cvmale.png";
import cvfemale from "@/assets/Images/cvfemale.png";
import cvother from "@/assets/Images/cvother.png";
interface IResumeData {
  basics: {
    name: string;
    email: string;
    image?: string;
    gender?: string;
    phone?: string;
    address?: string;
    dateofbirth?: string;
  };
  work: IJob[];
  education: IEducation[];
  languages: ILanguage[];
  skills: ISkill[];
}

interface IJob {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  summary: string;
}

interface IEducation {
  school: string;
  degree: string;
  major: string;
  graduationType: string;
  startDate: string;
  endDate: string;
  summary: string;
}

interface ILanguage {
  language: string;
  proficiency: string;
}

interface ISkill {
  name: string;
}

interface CvPreviewProps {
  formData: IResumeData;
}
const getDefaultImage = (gender: string | undefined) => {
  if (gender === "Nam") {
    return cvmale;
  } else if (gender === "Nữ") {
    return cvfemale;
  } else {
    return cvother; // You can set a default image for other cases if needed
  }
};
const CvPreview: React.FC<CvPreviewProps> = ({ formData }) => {
  const { basics, work, education, languages, skills } = formData;

  // State để lưu theme
  const [theme, setTheme] = useState<string>("default");

  return (
    <div>
      {/* Dropdown chọn theme */}
      <div style={{ marginBottom: 20, textAlign: "center" }}>
        <label htmlFor="theme-select" style={{ marginRight: 10 }}>
          Chọn Giao Diện:
        </label>
        <select
          id="theme-select"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "5px",
            fontSize: "14px",
            border: "1px solid #ccc",
          }}
        >
          <option value="default">Default Theme</option>
          <option value="dark">Dark Theme</option>
          <option value="light">Light Theme</option>
          <option value="gray">Gray Theme</option>
          <option value="beige">Beige Theme</option>
          <option value="taupe">Taupe Theme</option>
          <option value="slate">Slate Theme</option>
        </select>
      </div>

      {/* CV Preview với theme */}
      <div className={`${styles["cv-container"]} ${styles[theme]}`}>
        {/* Header */}
        <div className={styles["cv-header"]}>
          <img
            src={getDefaultImage(basics.gender)}
            alt={`${basics.name}'s profile`}
            className={styles["cv-image"]}
            style={{
              width: "200px",
              height: "200px",
              borderRadius: "50%",
              objectFit: "cover",
              marginBottom: "10px",
            }}
          />
          <div className={styles["left-align"]}>
            <h1>Họ và tên: {basics.name}</h1>
            <p style={{ fontSize: "16px" }}>
              <MailOutlined style={{ marginRight: "5px" }} />
              Email: {basics.email}
            </p>
            <p style={{ fontSize: "16px" }}>
              <PhoneOutlined style={{ marginRight: "5px" }} />
              Số điện thoại: {basics.phone}
            </p>
            <p style={{ fontSize: "16px" }}>
              <EnvironmentFilled style={{ marginRight: "5px" }} />
              Địa chỉ: {basics.address}
            </p>
            <p style={{ fontSize: "16px" }}>
              <CalculatorOutlined style={{ marginRight: "5px" }} />
              Ngày sinh: {basics.dateofbirth}
            </p>
            <p style={{ fontSize: "16px" }}>
              <QuestionCircleOutlined style={{ marginRight: "5px" }} />
              Giới tính: {basics.gender}
            </p>
          </div>
        </div>

        {/* Kinh nghiệm làm việc */}
        <div className={styles["cv-section"]}>
          <h2>Kinh nghiệm làm việc</h2>
          {work.map((job: IJob, index: number) => (
            <div key={index} className={styles["cv-item"]}>
              <h3>Công ty: {job.company}</h3>
              <p>Vị trí: {job.position}</p>
              <p>Mô tả công việc: {job.summary}</p>
              <p>
                {job.startDate} - {job.endDate}
              </p>
            </div>
          ))}
        </div>

        {/* Học vấn */}
        <div className={styles["cv-section"]}>
          <h2>Học vấn</h2>
          {education.map((edu: IEducation, index: number) => (
            <div key={index} className={styles["cv-item"]}>
              <h3>Trường: {edu.school}</h3>
              <p>
                Bằng cấp: {edu.degree} - Ngành: {edu.major}
              </p>
              <p>Loại: {edu.graduationType}</p>
              <p>
                {edu.startDate} - {edu.endDate}
              </p>
              <p>{edu.summary}</p>
            </div>
          ))}
        </div>

        {/* Ngoại ngữ */}
        <div className={styles["cv-section"]}>
          <h2>Ngoại ngữ</h2>
          {languages.map((lang: ILanguage, index: number) => (
            <div key={index} className={styles["cv-item"]}>
              <p>
                {lang.language}: {lang.proficiency}
              </p>
            </div>
          ))}
        </div>

        {/* Kỹ năng */}
        <div className={styles["cv-section"]}>
          <h2>Kỹ năng</h2>
          {skills.map((skill: ISkill, index: number) => (
            <div key={index} className={styles["cv-item"]}>
              <p>{skill.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CvPreview;
