import React, { useCallback, useEffect, useState } from "react";
import {
  WrapperContentProfile,
  WrapperHeader,
  WrapperInput,
  WrapperLable,
} from "./style";
import InputForm from "../../components/InputForm/InputForm";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { useDispatch, useSelector } from "react-redux";
import * as UserServices from "../../services/UserServices";
import { useMutationHooks } from "../../hooks/useMutationHook";
import Loading from "../../components/LoadingComponent/Loading";
import { Button, message, Upload } from "antd";
import { updateUser } from "../../redux/slides/userSlide";
import { UploadOutlined } from "@ant-design/icons";
import { getBase64 } from "../../utils";

const Profile = () => {
  const user = useSelector((state) => state.user);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [avatar, setAvatar] = useState("");

  const mutation = useMutationHooks((data) => {
    const { id, access_token, ...rests } = data;
    return UserServices.updateUser(id, rests, access_token);
  });

  const dispatch = useDispatch();
  const { data, isPending, isSuccess, isError } = mutation;
  console.log("data", data);

  useEffect(() => {
    setEmail(user?.email);
    setName(user?.name);
    setAvatar(user?.avatar);
    setPhone(user?.phone);
    setAddress(user?.address);
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
    if (isSuccess) {
      message.success("Thông tin đã được cập nhật!");
      handleUpdateUser(user?.id, user?.access_token);
    } else if (isError) {
      message.error("Cập nhật thất bại vui lòng xem lại định dạng!");
    }
  }, [isSuccess, isError, handleUpdateUser, user?.id, user?.access_token]);

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

  const handleUpdate = () => {
    mutation.mutate({
      id: user?.id,
      email,
      phone,
      name,
      avatar,
      address,
      access_token: user?.access_token,
    });
  };

  return (
    <div style={{ width: "1270px", margin: "0 auto", height: "500px" }}>
      <WrapperHeader>Thông tin người dùng</WrapperHeader>
      <Loading isPending={isPending}>
        <WrapperContentProfile>
          <WrapperInput>
            <WrapperLable htmlFor="name">Name</WrapperLable>
            <InputForm
              style={{ width: "300px" }}
              id="name"
              value={name}
              onChange={handleOnchangeName}
            />
            <ButtonComponent
              onClick={handleUpdate}
              size={40}
              styleButton={{
                height: "30px",
                width: "fit-content",
                borderRadius: "4px",
                padding: "2px 6px 6px",
              }}
              textButton={"Cập nhật"}
              styleTextButton={{
                color: "rgb(26, 148, 255)",
                fontSize: "15px",
                fontWeight: "700",
              }}
            ></ButtonComponent>
          </WrapperInput>
          <WrapperInput>
            <WrapperLable htmlFor="email">Email</WrapperLable>
            <InputForm
              style={{ width: "300px" }}
              id="email"
              value={email}
              disabled
            />
          </WrapperInput>
          <WrapperInput>
            <WrapperLable htmlFor="phone">Phone</WrapperLable>
            <InputForm
              style={{ width: "300px" }}
              id="phone"
              value={phone}
              onChange={handleOnchangePhone}
              placeholder="example: 0313456789"
            />
            <ButtonComponent
              onClick={handleUpdate}
              size={40}
              styleButton={{
                height: "30px",
                width: "fit-content",
                borderRadius: "4px",
                padding: "2px 6px 6px",
              }}
              textButton={"Cập nhật"}
              styleTextButton={{
                color: "rgb(26, 148, 255)",
                fontSize: "15px",
                fontWeight: "700",
              }}
            ></ButtonComponent>
          </WrapperInput>
          <WrapperInput>
            <WrapperLable htmlFor="avatar">Avatar</WrapperLable>
            <Upload
              onChange={handleOnchangeAvatar}
              showUploadList={false}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Select File</Button>
            </Upload>

            {avatar && (
              <img
                src={avatar}
                alt="avatar"
                style={{
                  height: "60px",
                  width: "60px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            )}
            <ButtonComponent
              onClick={handleUpdate}
              size={40}
              styleButton={{
                height: "30px",
                width: "fit-content",
                borderRadius: "4px",
                padding: "2px 6px 6px",
              }}
              textButton={"Cập nhật"}
              styleTextButton={{
                color: "rgb(26, 148, 255)",
                fontSize: "15px",
                fontWeight: "700",
              }}
            ></ButtonComponent>
          </WrapperInput>
          <WrapperInput>
            <WrapperLable htmlFor="address">Address</WrapperLable>
            <InputForm
              style={{ width: "300px" }}
              id="address"
              value={address}
              onChange={handleOnchangeAddress}
            />
            <ButtonComponent
              onClick={handleUpdate}
              size={40}
              styleButton={{
                height: "30px",
                width: "fit-content",
                borderRadius: "4px",
                padding: "2px 6px 6px",
              }}
              textButton={"Cập nhật"}
              styleTextButton={{
                color: "rgb(26, 148, 255)",
                fontSize: "15px",
                fontWeight: "700",
              }}
            ></ButtonComponent>
          </WrapperInput>
        </WrapperContentProfile>
      </Loading>
    </div>
  );
};

export default Profile;
