import { PlusOutlined } from "@ant-design/icons";

export const isJsonString = (data) => {
  try {
    JSON.parse(data);
  } catch (error) {
    return false;
  }
  return true;
};

export const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

export const renderOptions = (arr = []) => {
  return [
    ...arr.map((otp) => ({ value: otp, label: otp })),
    {
      label: (
        <>
          <PlusOutlined style={{ marginRight: 5 }} /> Thêm Type
        </>
      ),
      value: "add_type",
    },
  ];
};
