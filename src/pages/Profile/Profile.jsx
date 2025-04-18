import React, { useCallback, useEffect, useState } from "react";
import {
  ModalContent,
  ModalFooter,
  ModalInput,
  ModalLabel,
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
import { Button, DatePicker, message, Modal, Select, Upload } from "antd";
import { updateUser } from "../../redux/slides/userSlide";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  LockOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { getBase64 } from "../../utils";
import dayjs from "dayjs";

const Profile = () => {
  const { Option } = Select;
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [avatar, setAvatar] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const mutation = useMutationHooks((data) => {
    const { id, access_token, ...rests } = data;
    return UserServices.updateUser(id, rests, access_token);
  });

  const passwordMutation = useMutationHooks((data) => {
    return UserServices.changePassword(user?.id, data, user?.access_token);
  });

  const { data, isPending, isSuccess, isError } = mutation;
  const {
    data: passwordData,
    isSuccess: isPasswordSuccess,
    isError: isPasswordError,
  } = passwordMutation;

  useEffect(() => {
    setEmail(user?.email);
    setName(user?.name);
    setAvatar(user?.avatar);
    setPhone(user?.phone);
    setCity(user?.city);
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
      message.open({
        type: "success",
        content: data?.message || "Cập nhật thành công!",
        duration: 3,
        icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
      });
      handleUpdateUser(user?.id, user?.access_token);
    } else if (isError) {
      message.open({
        type: "error",
        content: data?.message || "Đã xảy ra lỗi! Vui lòng thử lại.",
        duration: 5,
        icon: <CloseCircleOutlined style={{ color: "#ff4d4f" }} />,
      });
    }
  }, [
    isSuccess,
    isError,
    handleUpdateUser,
    user?.id,
    user?.access_token,
    data,
  ]);

  useEffect(() => {
    if (isPasswordSuccess && passwordData?.status === "OK") {
      message.success(passwordData?.message || "Đổi mật khẩu thành công!");
      setIsModalOpen(false);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else if (isPasswordError && passwordData) {
      message.error(
        passwordData?.message || "Đổi mật khẩu thất bại, vui lòng thử lại."
      );
    }
  }, [isPasswordSuccess, isPasswordError, passwordData]);

  useEffect(() => {
    if (passwordData && passwordData.status === "ERR") {
      console.log("Password Change Error:", passwordData);
      message.error(passwordData.message);
    }
  }, [passwordData]);

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

  const handleOnchangeCity = (value) => {
    setCity(value);
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
    setCity(user?.city);
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
      city,
      access_token: user?.access_token,
    });
  };

  const handleChangePassword = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      message.error("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    if (newPassword.length < 8) {
      message.error("Mật khẩu mới phải có ít nhất 8 ký tự!");
      return;
    }

    if (!/[0-9]/.test(newPassword)) {
      message.error("Mật khẩu mới phải chứa ít nhất một chữ số!");
      return;
    }

    if (!/[!@#$%^&*]/.test(newPassword)) {
      message.error("Mật khẩu mới phải chứa ít nhất một ký tự đặc biệt!");
      return;
    }

    if (newPassword !== confirmPassword) {
      message.error("Mật khẩu mới không khớp!");
      return;
    }

    passwordMutation.mutate({
      oldPassword,
      newPassword,
      confirmPassword,
    });
  };
  const handleCancelModal = () => {
    setIsModalOpen(false);
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
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
              disabled={user?.isAdmin}
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
            <WrapperLable htmlFor="city">Thành Phố</WrapperLable>
            <InputForm
              id="city"
              value={city}
              placeholder="Nhập thành phố"
              onChange={handleOnchangeCity}
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
          <ButtonComponent
            textButton="Đổi mật khẩu"
            icon={<LockOutlined />}
            onClick={() => setIsModalOpen(true)}
            styleButton={{
              background: "#FF5733",
              color: "#fff",
              marginTop: "20px",
              padding: "10px 20px",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "500",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          />
        </WrapperContentProfile>
      </Loading>

      <Modal
        title="Đổi mật khẩu"
        open={isModalOpen}
        onCancel={handleCancelModal}
        footer={null}
      >
        <ModalContent>
          <div>
            <ModalLabel htmlFor="oldPassword">Mật khẩu cũ</ModalLabel>
            <ModalInput
              id="oldPassword"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Nhập mật khẩu cũ"
            />
          </div>

          <div>
            <ModalLabel htmlFor="newPassword">Mật khẩu mới</ModalLabel>
            <ModalInput
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Nhập mật khẩu mới"
            />
          </div>

          <div>
            <ModalLabel htmlFor="confirmPassword">Xác nhận mật khẩu</ModalLabel>
            <ModalInput
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Xác nhận mật khẩu mới"
            />
          </div>

          <ModalFooter>
            <Button key="cancel" onClick={handleCancelModal}>
              Hủy
            </Button>
            <Button key="submit" type="primary" onClick={handleChangePassword}>
              Xác nhận
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Profile;
