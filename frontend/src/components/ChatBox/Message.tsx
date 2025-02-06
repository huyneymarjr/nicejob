"use client"
import { GoogleOutlined, UserOutlined } from "@ant-design/icons"
import { Avatar, Skeleton } from "antd"
import React, { useEffect } from "react"

export const MessageLeft = (props: any) => {
    const { message = "no message", loading } = props

    return (
        <div className="flex w-full pl-2">
            <Avatar className="text-white w-10 h-10">
                <GoogleOutlined />
            </Avatar>
            <div className=" ml-1 w-[90%]">
                <div className="bg-blue-300 p-1 rounded-lg inline-block w-full">
                    {loading ? (
                        <Skeleton loading={loading} className="w-[100%]" />
                    ) : (
                        <p className="text-sm leading-normal">{message}</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export const MessageRight = (props: any) => {
    const { message = "no message" } = props

    return (
        <div className="flex w-full justify-end pr-2">
            <div className="ml-5 ">
                <div className="text-lg font-bold relative right-5 flex justify-end"></div>
                <div className="bg-gray-300 p-1 rounded-lg inline-block float-right mr-2">
                    <p className="text-sm leading-normal">{message}</p>
                </div>
            </div>

            <Avatar
                icon={<UserOutlined />}
                className="text-white w-10 h-10"
            ></Avatar>
        </div>
    )
}
