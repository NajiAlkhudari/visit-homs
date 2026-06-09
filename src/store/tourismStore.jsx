import axios from "axios";
import { create } from "zustand";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const resolveImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  return `${process.env.NEXT_PUBLIC_API_URL}${url}`;
};

export const useTourismStore = create((set) => ({
  loading: false,
  error: null,
  places: [],
  place: null,
  events: [],
  event: null,
  article: null,
  searchResults: [],

  getPublishedPlaces: async (lang = "en", categoryId = null) => {
    set({ loading: true, error: null });

    try {
      const query = new URLSearchParams({ lang });
      if (categoryId) {
        query.set("categoryId", categoryId);
      }

      const response = await axios.get(
        `${apiUrl}/api/Place/published?${query.toString()}`,
        {
          headers: {
            "Content-Type": "application/json",
            Version: 1.0,
          },
        }
      );

      set({
        places: response.data.data ?? [],
        loading: false,
      });
    } catch (error) {
      set({
        error: error?.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  getPlaceById: async (id, lang = "en") => {
    set({ loading: true, error: null, place: null });

    try {
      const response = await axios.get(
        `${apiUrl}/api/Place/${id}?lang=${lang}`,
        {
          headers: {
            "Content-Type": "application/json",
            Version: 1.0,
          },
        }
      );

      const place = response.data.data ?? null;
      set({ place, loading: false });
      return place;
    } catch (error) {
      set({
        error: error?.response?.data?.message || error.message,
        loading: false,
        place: null,
      });
      return null;
    }
  },

  getUpcomingEvents: async (lang = "en") => {
    set({ loading: true, error: null });

    try {
      const response = await axios.get(
        `${apiUrl}/api/Event/upcoming?lang=${lang}`,
        {
          headers: {
            "Content-Type": "application/json",
            Version: 1.0,
          },
        }
      );

      set({
        events: response.data.data ?? [],
        loading: false,
      });
    } catch (error) {
      set({
        error: error?.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  getEventById: async (id, lang = "en") => {
    set({ loading: true, error: null, event: null });

    try {
      const response = await axios.get(
        `${apiUrl}/api/Event/${id}?lang=${lang}`,
        {
          headers: {
            "Content-Type": "application/json",
            Version: 1.0,
          },
        }
      );

      const event = response.data.data ?? null;
      set({ event, loading: false });
      return event;
    } catch (error) {
      set({
        error: error?.response?.data?.message || error.message,
        loading: false,
        event: null,
      });
      return null;
    }
  },

  getArticleBySlug: async (slug, lang = "en") => {
    set({ loading: true, error: null, article: null });

    try {
      const response = await axios.get(
        `${apiUrl}/api/Article/slug/${slug}?lang=${lang}`,
        {
          headers: {
            "Content-Type": "application/json",
            Version: 1.0,
          },
        }
      );

      const article = response.data.data ?? null;
      set({ article, loading: false });
      return article;
    } catch (error) {
      set({
        error: error?.response?.data?.message || error.message,
        loading: false,
        article: null,
      });
      return null;
    }
  },

  search: async (query) => {
    set({ loading: true, error: null, searchResults: [] });

    try {
      const response = await axios.get(
        `${apiUrl}/api/Search?q=${encodeURIComponent(query)}`,
        {
          headers: {
            "Content-Type": "application/json",
            Version: 1.0,
          },
        }
      );

      set({
        searchResults: response.data.data ?? [],
        loading: false,
      });
    } catch (error) {
      set({
        error: error?.response?.data?.message || error.message,
        loading: false,
        searchResults: [],
      });
    }
  },
}));
