import { createSlice } from "@reduxjs/toolkit";

const initialState = JSON.parse(localStorage.getItem("user")) || {
  name: "",
  email: "",
  phone: "",
  address: "",
  avatar: "",
  gender: "",
  dob: "",
  access_token: "",
  id: "",
  isAdmin: false,
  city: "",
};

export const userSlide = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUser: (state, action) => {
      const {
        name = state.name,
        email = state.email,
        phone = state.phone,
        address = state.address,
        avatar = state.avatar,
        gender = state.gender,
        dob = state.dob,
        city = state.city,
        isAdmin = state.isAdmin,
        _id = state.id,
        access_token = state.access_token,
      } = action.payload;

      state.name = name;
      state.email = email;
      state.phone = phone;
      state.address = address;
      state.avatar = avatar;
      state.gender = gender;
      state.dob = dob;
      state.city = city;
      state.isAdmin = isAdmin;
      state.id = _id;
      state.access_token = access_token;

      localStorage.setItem("user", JSON.stringify(state));
    },

    resetUser: () => {
      localStorage.removeItem("user");
      localStorage.removeItem("access_token");
      return {
        name: "",
        email: "",
        phone: "",
        address: "",
        avatar: "",
        gender: "",
        dob: "",
        id: "",
        access_token: "",
        isAdmin: false,
        city: "",
      };
    },
  },
});

export const { updateUser, resetUser } = userSlide.actions;

export default userSlide.reducer;
