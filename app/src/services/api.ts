// API Service Layer for Our Moments

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000/api';

// 🔥 Generic fetch helper (FIXED)
async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    credentials: 'include', // important for CORS
  });

  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;

    try {
      const error = await response.json();
      errorMessage = error.error || errorMessage;
    } catch {}

    throw new Error(errorMessage);
  }

  return response.json();
}

//
// ============ MOMENTS API ============
//

export interface Moment {
  _id: string;
  title: string;
  short: string;
  full: string;
  date: string;
  imageUrl: string;
  cloudinaryId: string;
  createdAt: string;
  updatedAt: string;
}

export interface MomentFormData {
  title: string;
  short: string;
  full: string;
  date: string;
  image?: File | null;
}

export const momentsAPI = {
  getAll: () => fetchAPI<Moment[]>('/moments'),

  getById: (id: string) =>
    fetchAPI<Moment>(`/moments/${id}`),

  create: async (data: MomentFormData) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('short', data.short);
    formData.append('full', data.full);
    formData.append('date', data.date);

    if (data.image) {
      formData.append('image', data.image);
    }

    return fetchAPI<Moment>('/moments', {
      method: 'POST',
      body: formData,
    });
  },

  update: async (id: string, data: MomentFormData) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('short', data.short);
    formData.append('full', data.full);
    formData.append('date', data.date);

    if (data.image) {
      formData.append('image', data.image);
    }

    return fetchAPI<Moment>(`/moments/${id}`, {
      method: 'PUT',
      body: formData,
    });
  },

  delete: (id: string) =>
    fetchAPI<{ message: string }>(`/moments/${id}`, {
      method: 'DELETE',
    }),
};

//
// ============ GALLERY API ============
//

export interface GalleryImage {
  _id: string;
  imageUrl: string;
  cloudinaryId: string;
  caption: string;
  createdAt: string;
  updatedAt: string;
}

export const galleryAPI = {
  getAll: () => fetchAPI<GalleryImage[]>('/gallery'),

  getById: (id: string) =>
    fetchAPI<GalleryImage>(`/gallery/${id}`),

  upload: async (files: FileList, caption?: string) => {
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }

    if (caption) {
      formData.append('caption', caption);
    }

    return fetchAPI<GalleryImage[]>('/gallery', {
      method: 'POST',
      body: formData,
    });
  },

  updateCaption: (id: string, caption: string) =>
    fetchAPI<GalleryImage>(`/gallery/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ caption }),
    }),

  delete: (id: string) =>
    fetchAPI<{ message: string }>(`/gallery/${id}`, {
      method: 'DELETE',
    }),
};

//
// ============ LETTERS API ============
//

export interface Letter {
  _id: string;
  title: string;
  content: string;
  password: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LetterPublic {
  id: string;
  title: string;
  hasPassword: boolean;
}

export interface LetterVerified {
  id: string;
  title: string;
  content: string;
}

export const lettersAPI = {
  getPublic: () =>
    fetchAPI<LetterPublic>('/letters'),

  verify: async (password: string) => {
    const response = await fetch(
      `${API_BASE_URL}/letters/verify`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
        credentials: 'omit',
      }
    );

    if (!response.ok) {
      let errorMessage = 'Incorrect password';

      try {
        const error = await response.json();
        errorMessage = error.error || errorMessage;
      } catch {}

      throw new Error(errorMessage);
    }

    return response.json() as Promise<LetterVerified>;
  },

  create: (data: {
    title: string;
    content: string;
    password?: string;
  }) =>
    fetchAPI<Letter>('/letters', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<Letter>) =>
    fetchAPI<Letter>(`/letters/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    fetchAPI<{ message: string }>(`/letters/${id}`, {
      method: 'DELETE',
    }),
};

//
// ============ HEALTH CHECK ============
//

export const healthAPI = {
  check: () =>
    fetchAPI<{ status: string; timestamp: string }>(
      '/health'
    ),
};
