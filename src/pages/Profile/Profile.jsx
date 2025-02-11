import React, { useCallback, useEffect, useState } from "react";
import {
  WrapperContentProfile,
  WrapperHeader,
  WrapperInput,
  WrapperInputAvatar,
  WrapperLable,
} from "./style";
import InputForm from "../../components/InputForm/InputForm";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { useDispatch, useSelector } from "react-redux";
import * as UserServices from "../../services/UserServices";
import { useMutationHooks } from "../../hooks/useMutationHook";
import Loading from "../../components/LoadingComponent/Loading";
import { Button, DatePicker, message, Select, Upload } from "antd";
import { updateUser } from "../../redux/slides/userSlide";
import { UploadOutlined } from "@ant-design/icons";
import { getBase64 } from "../../utils";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { Option } = Select;
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [avatar, setAvatar] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");

  const mutation = useMutationHooks((data) => {
    const { id, access_token, ...rests } = data;
    return UserServices.updateUser(id, rests, access_token);
  });

  useEffect(() => {
    if (!user?.access_token) {
      navigate("/");
    }
  }, [user?.access_token, navigate]);

  const dispatch = useDispatch();
  const { data, isPending, isSuccess, isError } = mutation;

  useEffect(() => {
    setEmail(user?.email);
    setName(user?.name);
    setAvatar(user?.avatar);
    setPhone(user?.phone);
    setAddress(user?.address);
    setGender(user?.gender);
    setDob(user?.dob);
  }, [user]);

  const handleUpdateUser = useCallback(
    async (id, token) => {
      const res = await UserServices.getDetailsUser(id, token);
      dispatch(updateUser({ ...res?.data, access_token: token }));
    },
    [dispatch]
  );

  // const handleUpdateUser = async (id, token) => {
  //   const res = await UserServices.getDetailsUser(id, token);
  //   dispatch(updateUser({ ...res?.data, access_token: token }));
  // };

  useEffect(() => {
    if (isSuccess && data?.status === "OK") {
      message.success(data?.message);
      handleUpdateUser(user?.id, user?.access_token);
    } else if (isError) {
      message.error(data?.message);
    }
  }, [
    isSuccess,
    isError,
    handleUpdateUser,
    user?.id,
    user?.access_token,
    data,
  ]);

  const handleOnchangeName = (value) => {
    setName(value);
  };

  const handleOnchangePhone = (value) => {
    if (/^\d*$/.test(value)) {
      if (value.length > 10) {
        message.error("Số điện thoại không đúng định dạng!");
        return;
      }
      if (value.length < 10) {
        setPhone(value);
      } else if (!/^0\d{9}$/.test(value)) {
        message.error("Số điện thoại không đúng định dạng!");
      } else {
        setPhone(value);
      }
    } else {
      message.error("Số điện thoại chỉ được chứa số!");
    }
  };

  const handleOnchangeAddress = (value) => {
    setAddress(value);
  };

  const handleOnchangeAvatar = async ({ fileList }) => {
    if (!fileList || fileList.length === 0) {
      return;
    }

    const file = fileList[fileList.length - 1];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("File quá lớn! Vui lòng chọn file nhỏ hơn 10MB.");
      return;
    }

    let preview = file.url || file.preview;
    if (!preview && file.originFileObj) {
      try {
        preview = await getBase64(file.originFileObj);
      } catch (error) {
        console.error("Lỗi khi chuyển file sang Base64:", error);
        alert("Không thể hiển thị ảnh, vui lòng thử lại!");
        return;
      }
    }

    setAvatar(preview);
  };

  const handleOnchangeGender = (value) => {
    setGender(value);
  };

  const handleOnchangeDob = (date) => {
    setDob(date ? date.toDate() : null);
  };

  const handleCancel = () => {
    setEmail(user?.email);
    setName(user?.name);
    setAvatar(user?.avatar);
    setPhone(user?.phone);
    setAddress(user?.address);
    setGender(user?.gender);
    setDob(user?.dob);
  };

  const handleUpdate = () => {
    mutation.mutate({
      id: user?.id,
      email,
      phone,
      name,
      gender,
      dob,
      avatar,
      address,
      access_token: user?.access_token,
    });
  };

  return (
    <div style={{ width: "1270px", margin: "0 auto" }}>
      <WrapperHeader>Thông tin người dùng</WrapperHeader>

      <Loading isPending={isPending}>
        <WrapperContentProfile>
          <WrapperInputAvatar>
            {avatar && (
              <img
                src={avatar}
                alt="avatar"
                style={{
                  height: "80px",
                  width: "80px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid #1A94FF",
                  marginBottom: "10px",
                }}
              />
            )}
            <Upload
              onChange={handleOnchangeAvatar}
              showUploadList={false}
              maxCount={1}
            >
              <Button
                icon={<UploadOutlined />}
                style={{
                  background: "#1A94FF",
                  color: "#fff",
                  borderRadius: "8px",
                }}
              >
                Chọn ảnh
              </Button>
            </Upload>
          </WrapperInputAvatar>

          <WrapperInput>
            <WrapperLable htmlFor="name">Tên</WrapperLable>
            <InputForm
              id="name"
              value={name}
              placeholder="Nhập tên"
              onChange={handleOnchangeName}
              style={{
                width: "100%",
                borderRadius: "8px",
                padding: "8px",
                border: "1px solid #ddd",
              }}
            />
          </WrapperInput>

          <WrapperInput>
            <WrapperLable htmlFor="email">Email</WrapperLable>
            <InputForm
              id="email"
              value={email}
              disabled
              style={{
                width: "100%",
                borderRadius: "8px",
                padding: "8px",
                background: "#f5f5f5",
                border: "1px solid #ddd",
              }}
            />
          </WrapperInput>

          <WrapperInput>
            <WrapperLable htmlFor="phone">Số điện thoại</WrapperLable>
            <InputForm
              id="phone"
              value={phone}
              onChange={handleOnchangePhone}
              placeholder="Nhập số điện thoại VD: 0313456789"
              style={{
                width: "100%",
                borderRadius: "8px",
                padding: "8px",
                border: "1px solid #ddd",
              }}
            />
          </WrapperInput>

          <WrapperInput>
            <WrapperLable htmlFor="address">Địa chỉ</WrapperLable>
            <InputForm
              id="address"
              value={address}
              placeholder="Nhập địa chỉ"
              onChange={handleOnchangeAddress}
              style={{
                width: "100%",
                borderRadius: "8px",
                padding: "8px",
                border: "1px solid #ddd",
              }}
            />
          </WrapperInput>

          <WrapperInput>
            <WrapperLable htmlFor="gender">Giới tính</WrapperLable>
            <Select
              id="gender"
              style={{ width: "100%", borderRadius: "8px" }}
              placeholder="Chọn giới tính"
              value={gender || undefined}
              onChange={handleOnchangeGender}
              allowClear
            >
              <Option value="Nam">Nam</Option>
              <Option value="Nữ">Nữ</Option>
            </Select>
          </WrapperInput>

          <WrapperInput>
            <WrapperLable htmlFor="dob">Ngày sinh</WrapperLable>
            <DatePicker
              id="dob"
              value={dob ? dayjs(dob) : null}
              onChange={handleOnchangeDob}
              format="DD/MM/YYYY"
              style={{ width: "100%", borderRadius: "8px" }}
              placeholder="Chọn ngày"
            />
          </WrapperInput>

          <div
            style={{
              display: "flex",
              gap: "400px",
              alignItems: "center",
              marginTop: "10px",
            }}
          >
            <ButtonComponent
              onClick={handleCancel}
              size={40}
              styleButton={{
                height: "40px",
                background: "#ff4d4f",
                borderRadius: "8px",
                padding: "5px 10px",
                color: "#fff",
                fontSize: "16px",
                fontWeight: "bold",
                transition: "all 0.3s ease",
                cursor: "pointer",
              }}
              textButton={"Hủy"}
              styleTextButton={{ color: "#fff" }}
            />
            <ButtonComponent
              onClick={handleUpdate}
              size={40}
              styleButton={{
                height: "40px",
                background: "#1A94FF",
                borderRadius: "8px",
                padding: "5px 10px",
                color: "#fff",
                fontSize: "16px",
                fontWeight: "bold",
                transition: "all 0.3s ease",
                cursor: "pointer",
              }}
              textButton={"Cập nhật"}
              styleTextButton={{ color: "#fff" }}
            />
          </div>
        </WrapperContentProfile>
      </Loading>
    </div>
  );
};

export default Profile;
