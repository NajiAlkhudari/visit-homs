import axios from "axios";
import Cookies from "js-cookie";
import { create } from "zustand";

export const useSection = create((set) => ({
  loading: false,
  error: null,
  sections: [],
  categoriesWithTopics: [],
  topicBySlug: null,  // تخزين بيانات الموضوع المفردة حسب slug

  getSections: async (lang = "en") => {
    set({ loading: true, error: null });
    try {
      const token = Cookies.get("token");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/Category/tree?lang=${lang}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "Version" : 1.0,
          },
        }
      );
      set({
        sections: response.data.data,
        loading: false,
      });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  getCategoriesWithTopics: async (lang = "en") => {
    set({ loading: true, error: null });
    try {
      const token = Cookies.get("token");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/Category/with-topics?lang=${lang}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
                        "Version" : 1.0,

          },
        }
      );
      set({
        categoriesWithTopics: response.data.data,
        loading: false,
      });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  getTopicBySlug: async (slug , lang = "en") => {
    set({ loading: true, error: null, topicBySlug: null });
    try {
      const token = Cookies.get("token");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/Topic/slug/${slug}?lang=${lang}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
                        "Version" : 1.0,

          },
        }
      );
      set({
        topicBySlug: response.data.data,
        loading: false,
      });
    } catch (error) {
      set({ error: error.message, loading: false, topicBySlug: null });
    }
  },
}));
