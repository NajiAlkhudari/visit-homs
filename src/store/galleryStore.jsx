import axios from "axios";
import { create } from "zustand";
import Cookies from "js-cookie";

export const useGallery = create((set) => ({
  loading: false,
  error: null,
  galleries: [],

  getGallery: async () => {
    set({ loading: true, error: null });

    try {
      // const token = Cookies.get("token");
      // if (!token) {
      //   set({ error: "Unauthorized", loading: false });
      //   return;
      // }
      const token = Cookies.get("token");

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/Image`,
         {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
                                    "Version" : 1.0,

          },
        }
      );

      set({
        galleries: response.data.data,
        loading: false,
      });
    } catch (error) {
      set({
        error: error?.response?.data?.message || error.message,
        loading: false,
      });
    }
  },
}));
