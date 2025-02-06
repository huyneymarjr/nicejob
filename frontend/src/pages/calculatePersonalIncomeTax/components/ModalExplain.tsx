import { Modal } from "antd"
import React from "react"

const ModalExplain = ({
    isOpenModalExplain,
    setIsOpenModalExplain,
}: {
    isOpenModalExplain: boolean
    setIsOpenModalExplain: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    const handleOk = () => {
        setIsOpenModalExplain(false)
    }

    const handleCancel = () => {
        setIsOpenModalExplain(false)
    }
    return (
        <Modal
            title={
                <div>
                    <p className="text-[18px] font-bold">
                        Mức lương tối thiểu vùng
                    </p>
                    <p>
                        Áp dụng mức lương tối thiểu vùng mới nhất có hiệu lực từ
                        ngày 01/07/2024
                    </p>
                </div>
            }
            open={isOpenModalExplain}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={null}
            width={800}
        >
            <div>
                <ul className="list-disc ml-[40px] ">
                    <li>Vùng I: 4,960,000 đồng/tháng </li>
                    <li>Vùng II: 4,410,000 đồng/tháng </li>
                    <li>Vùng III: 3,860,000 đồng/tháng</li>
                    <li>Vùng IV: 3,450,000 đồng/tháng</li>
                </ul>
            </div>
            <div>
                <div>
                    <p className="text-[16px] font-bold">
                        1. Vùng I, gồm các địa bàn:
                    </p>
                    <ul className="list-disc ml-[40px]">
                        <li>
                            Các quận và các huyện Gia Lâm, Đông Anh, Sóc Sơn,
                            Thanh Trì, Thường Tín, Hoài Đức, Thạch Thất, Quốc
                            Oai, Thanh Oai, Mê Linh, Chương Mỹ và thị xã Sơn Tây
                            thuộc thành phố Hà Nội;
                        </li>
                        <li>
                            Các thành phố Hạ Long, Uông Bí, Móng Cái và các thị
                            xã Quảng Yên, Đông Triều thuộc tỉnh Quảng Ninh;{" "}
                        </li>
                        <li>
                            Các quận và các huyện Thủy Nguyên, An Dương, An Lão,
                            Vĩnh Bảo, Tiên Lãng, Cát Hải, Kiến Thụy thuộc thành
                            phố Hải Phòng;
                        </li>
                        <li>Thành phố Hải Dương thuộc tỉnh Hải Dương;</li>
                        <li>
                            Các quận, thành phố Thủ Đức và các huyện Củ Chi, Hóc
                            Môn, Bình Chánh, Nhà Bè thuộc Thành phố Hồ Chí Minh;
                        </li>
                        <li>
                            Các thành phố Biên Hòa, Long Khánh và các huyện Nhơn
                            Trạch, Long Thành, Vĩnh Cửu, Trảng Bom, Xuân Lộc,
                            Thống Nhất thuộc tỉnh Đồng Nai;
                        </li>
                        <li>
                            Các thành phố Thủ Dầu Một, Thuận An, Dĩ An, Tân
                            Uyên, Bến Cát và các huyện Bàu Bàng, Bắc Tân Uyên,
                            Dầu Tiếng, Phú Giáo thuộc tỉnh Bình Dương;
                        </li>
                        <li>
                            Thành phố Vũng Tàu, thị xã Phú Mỹ thuộc tỉnh Bà Rịa
                            - Vũng Tàu;
                        </li>
                        <li>
                            Thành phố Tân An và các huyện Đức Hòa, Bến Lức, Cần
                            Giuộc thuộc tỉnh Long An.
                        </li>
                    </ul>
                </div>
                <div>
                    <p className="text-[16px] font-bold">
                        2. Vùng II, gồm các địa bàn:
                    </p>
                    <ul className="list-disc ml-[40px]">
                        <li>Các huyện còn lại thuộc thành phố Hà Nội</li>
                        <li>Thành phố Lào Cai thuộc tỉnh Lào Cai</li>
                        <li>
                            Các thành phố Thái Nguyên, Sông Công và Phổ Yên
                            thuộc tỉnh Thái Nguyên
                        </li>
                        <li>
                            Thành phố Hoà Bình và huyện Lương Sơn thuộc tỉnh Hòa
                            Bình
                        </li>
                        <li>Thành phố Việt Trì thuộc tỉnh Phú Thọ</li>
                        <li>
                            Thành phố Bắc Giang, thị xã Việt Yên và huyện Yên
                            Dũng thuộc tỉnh Bắc Giang
                        </li>
                        <li>
                            Các thành phố Vĩnh Yên, Phúc Yên và các huyện Bình
                            Xuyên, Yên Lạc thuộc tỉnh Vĩnh Phúc
                        </li>
                        <li>
                            Các thành phố Bắc Ninh, Từ Sơn; các thị xã Thuận
                            Thành, Quế Võ và các huyện Tiên Du, Yên Phong, Gia
                            Bình, Lương Tài thuộc tỉnh Bắc Ninh
                        </li>
                        <li>
                            Thành phố Hưng Yên, thị xã Mỹ Hào và các huyện Văn
                            Lâm, Văn Giang, Yên Mỹ thuộc tỉnh Hưng Yên
                        </li>
                        <li>
                            Thành phố Chí Linh, thị xã Kinh Môn và các huyện Cẩm
                            Giàng, Bình Giang, Tứ Kỳ, Gia Lộc, Nam Sách, Kim
                            Thành thuộc tỉnh Hải Dương
                        </li>
                        <li>Thành phố Cẩm Phả thuộc tỉnh Quảng Ninh</li>
                        <li>Các huyện còn lại thuộc thành phố Hải Phòng</li>
                        <li>Thành phố Thái Bình thuộc tỉnh Thái Bình</li>
                        <li>
                            Thành phố Nam Định và huyện Mỹ Lộc thuộc tỉnh Nam
                            Định
                        </li>
                        <li>Thành phố Ninh Bình thuộc tỉnh Ninh Bình</li>
                        <li>
                            Các thành phố Thanh Hóa, Sầm Sơn và các thị xã Bỉm
                            Sơn, Nghi Sơn thuộc tỉnh Thanh Hóa
                        </li>
                        <li>
                            Thành phố Vinh, thị xã Cửa Lò và các huyện Nghi Lộc,
                            Hưng Nguyên thuộc tỉnh Nghệ An
                        </li>
                        <li>Thành phố Đồng Hới thuộc tỉnh Quảng Bình</li>
                        <li>Thành phố Huế thuộc tỉnh Thừa Thiên Huế</li>
                        <li>
                            Các thành phố Hội An, Tam Kỳ thuộc tỉnh Quảng Nam
                        </li>
                        <li>Các quận, huyện thuộc thành phố Đà Nẵng</li>
                        <li>
                            Các thành phố Nha Trang, Cam Ranh và thị xã Ninh Hòa
                            thuộc tỉnh Khánh Hòa
                        </li>
                        <li>
                            Các thành phố Đà Lạt, Bảo Lộc thuộc tỉnh Lâm Đồng
                        </li>
                        <li>Thành phố Phan Thiết thuộc tỉnh Bình Thuận</li>
                        <li>Huyện Cần Giờ thuộc Thành phố Hồ Chí Minh</li>
                        <li>
                            Thành phố Tây Ninh, các thị xã Trảng Bàng, Hòa Thành
                            và huyện Gò Dầu thuộc tỉnh Tây Ninh
                        </li>
                        <li>
                            Các huyện Định Quán, Tân Phú, Cẩm Mỹ thuộc tỉnh Đồng
                            Nai
                        </li>
                        <li>
                            Thành phố Đồng Xoài, thị xã Chơn Thành và huyện Đồng
                            Phú thuộc tỉnh Bình Phước
                        </li>
                        <li>Thành phố Bà Rịa thuộc tỉnh Bà Rịa - Vũng Tàu</li>
                        <li>
                            Các huyện Thủ Thừa, Cần Đước và thị xã Kiến Tường
                            thuộc tỉnh Long An
                        </li>
                        <li>
                            Thành phố Mỹ Tho và huyện Châu Thành thuộc tỉnh Tiền
                            Giang
                        </li>
                        <li>
                            Thành phố Bến Tre và huyện Châu Thành thuộc tỉnh Bến
                            Tre
                        </li>
                        <li>
                            Thành phố Vĩnh Long và thị xã Bình Minh thuộc tỉnh
                            Vĩnh Long
                        </li>
                        <li>Các quận thuộc thành phố Cần Thơ</li>
                        <li>
                            Các thành phố Rạch Giá, Hà Tiên, Phú Quốc thuộc tỉnh
                            Kiên Giang
                        </li>
                        <li>
                            Các thành phố Long Xuyên, Châu Đốc thuộc tỉnh An
                            Giang
                        </li>
                        <li>Thành phố Trà Vinh thuộc tỉnh Trà Vinh</li>
                        <li>Thành phố Sóc Trăng thuộc tỉnh Sóc Trăng</li>
                        <li>Thành phố Bạc Liêu thuộc tỉnh Bạc Liêu</li>
                        <li>Thành phố Cà Mau thuộc tỉnh Cà Mau</li>
                    </ul>
                </div>
                <div>
                    <p className="text-[16px] font-bold">
                        3. Vùng III, gồm các địa bàn:
                    </p>
                    <ul className="list-disc ml-[40px]">
                        <li>
                            Các thành phố trực thuộc tỉnh còn lại (trừ các thành
                            phố trực thuộc tỉnh nêu tại vùng I, vùng II)
                        </li>
                        <li>
                            Thị xã Sa Pa, huyện Bảo Thắng thuộc tỉnh Lào Cai
                        </li>
                        <li>
                            Các huyện Phú Bình, Phú Lương, Đồng Hỷ, Đại Từ thuộc
                            tỉnh Thái Nguyên
                        </li>
                        <li>
                            Các huyện Hiệp Hòa, Tân Yên, Lạng Giang thuộc tỉnh
                            Bắc Giang
                        </li>
                        <li>
                            Các huyện Ninh Giang, Thanh Miện, Thanh Hà thuộc
                            tỉnh Hải Dương
                        </li>
                        <li>
                            Thị xã Phú Thọ và các huyện Phù Ninh, Lâm Thao,
                            Thanh Ba, Tam Nông thuộc tỉnh Phú Thọ
                        </li>
                        <li>
                            Các huyện Vĩnh Tường, Tam Đảo, Tam Dương, Lập Thạch,
                            Sông Lô thuộc tỉnh Vĩnh Phúc
                        </li>
                        <li>
                            Các huyện Vân Đồn, Hải Hà, Đầm Hà, Tiên Yên thuộc
                            tỉnh Quảng Ninh
                        </li>
                        <li>Các huyện còn lại thuộc tỉnh Hưng Yên</li>
                        <li>
                            Các huyện Thái Thụy, Tiền Hải thuộc tỉnh Thái Bình
                        </li>
                        <li>Các huyện còn lại thuộc tỉnh Nam Định</li>
                        <li>
                            Thị xã Duy Tiên và huyện Kim Bảng thuộc tỉnh Hà Nam
                        </li>
                        <li>
                            Các huyện Gia Viễn, Yên Khánh, Hoa Lư thuộc tỉnh
                            Ninh Bình
                        </li>
                        <li>
                            Các huyện Đông Sơn, Quảng Xương, Triệu Sơn, Thọ
                            Xuân, Yên Định, Vĩnh Lộc, Thiệu Hóa, Hà Trung, Hậu
                            Lộc, Nga Sơn, Hoằng Hóa, Nông Cống thuộc tỉnh Thanh
                            Hóa
                        </li>
                        <li>
                            Các huyện Quỳnh Lưu, Yên Thành, Diễn Châu, Đô Lương,
                            Nam Đàn, Nghĩa Đàn và các thị xã Thái Hòa, Hoàng Mai
                            thuộc tỉnh Nghệ An
                        </li>
                        <li>Thị xã Kỳ Anh thuộc tỉnh Hà Tĩnh</li>
                        <li>
                            Các thị xã Hương Thủy, Hương Trà và các huyện Phú
                            Lộc, Phong Điền, Quảng Điền, Phú Vang thuộc tỉnh
                            Thừa Thiên Huế
                        </li>
                        <li>
                            Thị xã Điện Bàn và các huyện Đại Lộc, Duy Xuyên, Núi
                            Thành, Quế Sơn, Thăng Bình, Phú Ninh thuộc tỉnh
                            Quảng Nam
                        </li>
                        <li>
                            Các huyện Bình Sơn, Sơn Tịnh thuộc tỉnh Quảng Ngãi
                        </li>
                        <li>
                            Các thị xã Sông Cầu, Đông Hòa thuộc tỉnh Phú Yên
                        </li>
                        <li>
                            Các huyện Ninh Hải, Thuận Bắc, Ninh Phước thuộc tỉnh
                            Ninh Thuận
                        </li>
                        <li>
                            Các huyện Cam Lâm, Diên Khánh, Vạn Ninh thuộc tỉnh
                            Khánh Hòa
                        </li>
                        <li>Huyện Đăk Hà thuộc tỉnh Kon Tum</li>
                        <li>
                            Các huyện Đức Trọng, Di Linh thuộc tỉnh Lâm Đồng
                        </li>
                        <li>
                            Thị xã La Gi và các huyện Hàm Thuận Bắc, Hàm Thuận
                            Nam thuộc tỉnh Bình Thuận
                        </li>
                        <li>
                            Các thị xã Phước Long, Bình Long và các huyện Hớn
                            Quản, Lộc Ninh, Phú Riềng thuộc tỉnh Bình Phước
                        </li>
                        <li>Các huyện còn lại thuộc tỉnh Tây Ninh</li>
                        <li>
                            Các huyện Long Điền, Đất Đỏ, Xuyên Mộc, Châu Đức,
                            Côn Đảo thuộc tỉnh Bà Rịa - Vũng Tàu
                        </li>
                        <li>
                            Các huyện Đức Huệ, Châu Thành, Tân Trụ, Thạnh Hóa
                            thuộc tỉnh Long An
                        </li>
                        <li>
                            Thị xã Cai Lậy và các huyện Chợ Gạo, Tân Phước thuộc
                            tỉnh Tiền Giang
                        </li>
                        <li>
                            Các huyện Ba Tri, Bình Đại, Mỏ Cày Nam thuộc tỉnh
                            Bến Tre
                        </li>
                        <li>
                            Các huyện Mang Thít, Long Hồ thuộc tỉnh Vĩnh Long
                        </li>
                        <li>Các huyện thuộc thành phố Cần Thơ</li>
                        <li>
                            Các huyện Kiên Lương, Kiên Hải, Châu Thành thuộc
                            tỉnh Kiên Giang
                        </li>
                        <li>
                            Thị xã Tân Châu và các huyện Châu Phú, Châu Thành,
                            Thoại Sơn thuộc tỉnh An Giang
                        </li>
                        <li>
                            Các huyện Châu Thành, Châu Thành A thuộc tỉnh Hậu
                            Giang
                        </li>
                        <li>Thị xã Duyên Hải thuộc tỉnh Trà Vinh</li>
                        <li>
                            Thị xã Giá Rai và huyện Hòa Bình thuộc tỉnh Bạc Liêu
                        </li>
                        <li>
                            Các thị xã Vĩnh Châu, Ngã Năm thuộc tỉnh Sóc Trăng
                        </li>
                        <li>
                            Các huyện Năm Căn, Cái Nước, U Minh, Trần Văn Thời
                            thuộc tỉnh Cà Mau
                        </li>
                        <li>
                            Các huyện Lệ Thủy, Quảng Ninh, Bố Trạch, Quảng Trạch
                            và thị xã Ba Đồn thuộc tỉnh Quảng Bình
                        </li>
                    </ul>
                </div>
                <div>
                    <p className="text-[16px] font-bold">
                        4.Vùng IV, gồm các địa bàn còn lại
                    </p>
                </div>
            </div>
        </Modal>
    )
}

export default ModalExplain
