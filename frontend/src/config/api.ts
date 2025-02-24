import {
    IBackendRes,
    ICompany,
    IAccount,
    IUser,
    IModelPaginate,
    IGetAccount,
    IJob,
    IResume,
    IPermission,
    IRole,
    ISubscribers,
    IDataWithCodeId,
    INotification,
} from "@/types/backend"
import axios from "config/axios-customize"

/**
 * 
Module Auth
 */
export const callRegister = (
    name: string,
    email: string,
    password: string,
    age: number,
    gender: string,
    address: string
) => {
    return axios.post<IBackendRes<IUser>>("/api/v1/auth/register", {
        name,
        email,
        password,
        age,
        gender,
        address,
    })
}

export const callLogin = (username: string, password: string) => {
    return axios.post<IBackendRes<IAccount>>("/api/v1/auth/login", {
        username,
        password,
    })
}

export const callFetchAccount = () => {
    return axios.get<IBackendRes<IGetAccount>>("/api/v1/auth/account")
}

export const callRefreshToken = () => {
    return axios.get<IBackendRes<IAccount>>("/api/v1/auth/refresh")
}

export const callLogout = () => {
    return axios.post<IBackendRes<string>>("/api/v1/auth/logout")
}

export const callRetryPassword = (email: string, codeId?: string) => {
    return axios.post<IBackendRes<IDataWithCodeId>>(
        "/api/v1/auth/retry-password",
        { email, codeId }
    )
}
export const callForgotPassword = (
    code: string,
    password: string,
    confirmPassword: string,
    email: string
) => {
    return axios.post<IBackendRes<{ isBeforeCheck: boolean }>>(
        "/api/v2/auth/forgot-password",
        {
            code,
            password,
            confirmPassword,
            email,
        }
    )
}

export const callFetchProfile = () => {
    return axios.get<IBackendRes<IUser>>("/api/v1/auth/users/profile")
}

// kích hoạt tài khoản

export const checkCode = (body: { _id: string; code: string }) => {
    return axios.post("/api/v1/auth/check-code", body)
}
export const retryActive = (body: { email: string }) => {
    return axios.post("/api/v1/auth/retry-active", body)
}

/**
 * Upload single file
 */
export const callUploadSingleFile = (file: any, folderType: string) => {
    const bodyFormData = new FormData()
    bodyFormData.append("fileUpload", file)
    return axios<IBackendRes<{ fileName: string }>>({
        method: "post",
        url: "/api/v1/files/upload",
        data: bodyFormData,
        headers: {
            "Content-Type": "multipart/form-data",
            folder_type: folderType,
        },
    })
}

/**
 * 
Module Company
 */
export const callCreateCompany = (
    name: string,
    address: string,
    description: string,
    logo: string
) => {
    return axios.post<IBackendRes<ICompany>>("/api/v1/companies", {
        name,
        address,
        description,
        logo,
    })
}

export const callUpdateCompany = (
    id: string,
    name: string,
    address: string,
    description: string,
    logo: string
) => {
    return axios.patch<IBackendRes<ICompany>>(`/api/v1/companies/${id}`, {
        name,
        address,
        description,
        logo,
    })
}

export const callDeleteCompany = (id: string) => {
    return axios.delete<IBackendRes<ICompany>>(`/api/v1/companies/${id}`)
}

export const callFetchCompany = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<ICompany>>>(
        `/api/v1/companies?${query}`
    )
}

export const callFetchCompanyById = (id: string) => {
    return axios.get<IBackendRes<ICompany>>(`/api/v1/companies/${id}`)
}

export const callFetchCompanyTotalJobs = (id: string) => {
    return axios.get<IBackendRes<{ totalJobs: number }>>(
        `/api/v1/companies/${id}/total-jobs`
    )
}

/**
 * 
Module User
 */
export const callCreateUser = (user: IUser) => {
    return axios.post<IBackendRes<IUser>>("/api/v1/users", { ...user })
}

export const callUpdateUser = (user: IUser, id: string) => {
    return axios.patch<IBackendRes<IUser>>(`/api/v1/users/${id}`, { ...user })
}

export const callDeleteUser = (id: string) => {
    return axios.delete<IBackendRes<IUser>>(`/api/v1/users/${id}`)
}

export const callFetchUser = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IUser>>>(
        `/api/v1/users?${query}`
    )
}
export const callUpdateProfile = (
    name: string,
    age: number,
    gender: string,
    address: string
) => {
    return axios.post<IBackendRes<IUser>>("/api/v1/users/profile", {
        name,
        age,
        gender,
        address,
    })
}
export const callChangePassword = (
    oldPassword: string,
    newPassword: string,
    confirmPassword: string
) => {
    return axios.post<IBackendRes<string>>("/api/v1/users/change-password", {
        oldPassword,
        newPassword,
        confirmPassword,
    })
}

export const callAddress = () => {
    return axios.get<any>("https://provinces.open-api.vn/api/p/")
}

export const callGetProfile = () => {
    return axios.get<IBackendRes<IUser>>("/api/v1/auth/users/profile")
}
/**
 * 
Module Job
 */
export const callCreateJob = (job: IJob) => {
    return axios.post<IBackendRes<IJob>>("/api/v1/jobs", { ...job })
}

export const callUpdateJob = (job: IJob, id: string) => {
    return axios.patch<IBackendRes<IJob>>(`/api/v1/jobs/${id}`, { ...job })
}

export const callDeleteJob = (id: string) => {
    return axios.delete<IBackendRes<IJob>>(`/api/v1/jobs/${id}`)
}

export const callFetchJob = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IJob>>>(`/api/v1/jobs?${query}`)
}

export const callFetchJobById = (id: string) => {
    return axios.get<IBackendRes<IJob>>(`/api/v1/jobs/${id}`)
}
export const callSearchJobs = (skills: string[], location: string[]) => {
    return axios.get<IBackendRes<IJob[]>>("/api/v1/jobs", {
        params: {
            skills,
            location,
        },
    })
}
export const callFetchLocationsJobs = (companyId: string) => {
    return axios.get<IBackendRes<string[]>>(
        `/api/v1/jobs/locations/${companyId}`
    )
}
export const callFetchSkillsJobs = (companyId: string) => {
    return axios.get<IBackendRes<string[]>>(
        `/api/v1/jobs/skills/company/${companyId}`
    )
}
export const callFetchJobsByCompanyId = (companyId: string) => {
    return axios.get<IBackendRes<IJob[]>>(
        `/api/v1/jobs/by-company/${companyId}`
    )
}
export const callFetchJobByHr = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IJob>>>(
        `/api/v1/jobs/by-hr?${query}`
    )
}
/**
 * 
Module Resume
 */
export const callCreateResume = (url: string, companyId: any, jobId: any) => {
    return axios.post<IBackendRes<IResume>>("/api/v1/resumes", {
        url,
        companyId,
        jobId,
    })
}

export const callUpdateResumeStatus = (id: any, status: string) => {
    return axios.patch<IBackendRes<IResume>>(`/api/v1/resumes/${id}`, {
        status,
    })
}

export const callDeleteResume = (id: string) => {
    return axios.delete<IBackendRes<IResume>>(`/api/v1/resumes/${id}`)
}

export const callFetchResume = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IResume>>>(
        `/api/v1/resumes?${query}`
    )
}

export const callFetchResumeById = (id: string) => {
    return axios.get<IBackendRes<IResume>>(`/api/v1/resumes/${id}`)
}

export const callFetchResumeByUser = () => {
    return axios.post<IBackendRes<IResume[]>>(`/api/v1/resumes/by-user`)
}

/**
 * 
Module Permission
 */
export const callCreatePermission = (permission: IPermission) => {
    return axios.post<IBackendRes<IPermission>>("/api/v1/permissions", {
        ...permission,
    })
}

export const callUpdatePermission = (permission: IPermission, id: string) => {
    return axios.patch<IBackendRes<IPermission>>(`/api/v1/permissions/${id}`, {
        ...permission,
    })
}

export const callDeletePermission = (id: string) => {
    return axios.delete<IBackendRes<IPermission>>(`/api/v1/permissions/${id}`)
}

export const callFetchPermission = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IPermission>>>(
        `/api/v1/permissions?${query}`
    )
}

export const callFetchPermissionById = (id: string) => {
    return axios.get<IBackendRes<IPermission>>(`/api/v1/permissions/${id}`)
}

/**
 * 
Module Role
 */
export const callCreateRole = (role: IRole) => {
    return axios.post<IBackendRes<IRole>>("/api/v1/roles", { ...role })
}

export const callUpdateRole = (role: IRole, id: string) => {
    return axios.patch<IBackendRes<IRole>>(`/api/v1/roles/${id}`, { ...role })
}

export const callDeleteRole = (id: string) => {
    return axios.delete<IBackendRes<IRole>>(`/api/v1/roles/${id}`)
}

export const callFetchRole = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IRole>>>(
        `/api/v1/roles?${query}`
    )
}

export const callFetchRoleById = (id: string) => {
    return axios.get<IBackendRes<IRole>>(`/api/v1/roles/${id}`)
}

/**
 * 
Module Subscribers
 */
export const callCreateSubscriber = (subs: ISubscribers) => {
    return axios.post<IBackendRes<ISubscribers>>("/api/v1/subscribers", {
        ...subs,
    })
}

export const callGetSubscriberSkills = () => {
    return axios.post<IBackendRes<ISubscribers>>("/api/v1/subscribers/skills")
}

export const callUpdateSubscriber = (subs: ISubscribers) => {
    return axios.patch<IBackendRes<ISubscribers>>(`/api/v1/subscribers`, {
        ...subs,
    })
}

export const callDeleteSubscriber = (id: string) => {
    return axios.delete<IBackendRes<ISubscribers>>(`/api/v1/subscribers/${id}`)
}

export const callFetchSubscriber = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<ISubscribers>>>(
        `/api/v1/subscribers?${query}`
    )
}

export const callFetchSubscriberById = (id: string) => {
    return axios.get<IBackendRes<ISubscribers>>(`/api/v1/subscribers/${id}`)
}

/**
 * 
Module Notifications
 */
export const callFetchNotification = (querry: string) => {
    return axios.get<IBackendRes<IModelPaginate<INotification>>>(
        `/api/v1/notifications?${querry}`
    )
}

// dashboard
export const dashboardUser = () => {
    return axios.get(`/api/v1/users/statistics/dashboard`)
}
export const dashboardCompany = () => {
    return axios.get(`/api/v1/companies/statistics/dashboard`)
}
export const dashboardJob = () => {
    return axios.get(`/api/v1/jobs/statistics/dashboard`)
}
export const dashboardResume = () => {
    return axios.get(`/api/v1/resumes/statistics/dashboard`)
}
