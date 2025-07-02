"use client";

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

const firebaseConfig: FirebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  emailVerified: boolean;
  metadata: {
    creationTime: string;
    lastSignInTime: string;
  };
}

export interface AuthResponse {
  kind: string;
  localId: string;
  email: string;
  displayName?: string;
  idToken: string;
  refreshToken: string;
  expiresIn: string;
  registered?: boolean;
}

class FirebaseRestClient {
  private config: FirebaseConfig;
  private currentUser: User | null = null;
  private idToken: string | null = null;
  private refreshToken: string | null = null;

  constructor(config: FirebaseConfig) {
    this.config = config;
    this.loadFromStorage();
  }

  private loadFromStorage() {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("firebase_user");
      const token = localStorage.getItem("firebase_token");
      const refresh = localStorage.getItem("firebase_refresh");

      if (userData && token && refresh) {
        this.currentUser = JSON.parse(userData);
        this.idToken = token;
        this.refreshToken = refresh;
      }
    }
  }

  private saveToStorage() {
    if (typeof window !== "undefined") {
      if (this.currentUser && this.idToken && this.refreshToken) {
        localStorage.setItem("firebase_user", JSON.stringify(this.currentUser));
        localStorage.setItem("firebase_token", this.idToken);
        localStorage.setItem("firebase_refresh", this.refreshToken);
      } else {
        localStorage.removeItem("firebase_user");
        localStorage.removeItem("firebase_token");
        localStorage.removeItem("firebase_refresh");
      }
    }
  }

  private async refreshAccessToken(): Promise<boolean> {
    if (!this.refreshToken) return false;

    try {
      const response = await fetch(
        `https://securetoken.googleapis.com/v1/token?key=${this.config.apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            grant_type: "refresh_token",
            refresh_token: this.refreshToken,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        this.idToken = data.access_token;
        this.refreshToken = data.refresh_token;
        this.saveToStorage();
        return true;
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
    }

    return false;
  }

  async signInWithEmailAndPassword(
    email: string,
    password: string
  ): Promise<User> {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.config.apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Sign in failed");
    }

    const data: AuthResponse = await response.json();
    return this.handleAuthResponse(data);
  }

  async createUserWithEmailAndPassword(
    email: string,
    password: string
  ): Promise<User> {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.config.apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Sign up failed");
    }

    const data: AuthResponse = await response.json();
    return this.handleAuthResponse(data);
  }

  async updateProfile(displayName: string): Promise<void> {
    if (!this.idToken) throw new Error("Not authenticated");

    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${this.config.apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idToken: this.idToken,
          displayName,
          returnSecureToken: true,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Profile update failed");
    }

    const data = await response.json();
    if (this.currentUser) {
      this.currentUser.displayName = displayName;
      this.saveToStorage();
    }
  }

  async signInWithGoogle(): Promise<User> {
    // For simplicity, we'll redirect to Google OAuth
    const redirectUri = encodeURIComponent(
      window.location.origin + "/auth/callback"
    );
    const scope = encodeURIComponent("openid email profile");
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${this.config.messagingSenderId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;

    window.location.href = googleAuthUrl;
    throw new Error("Redirecting to Google OAuth");
  }

  private handleAuthResponse(data: AuthResponse): User {
    const user: User = {
      uid: data.localId,
      email: data.email,
      displayName: data.displayName,
      emailVerified: true,
      metadata: {
        creationTime: new Date().toISOString(),
        lastSignInTime: new Date().toISOString(),
      },
    };

    this.currentUser = user;
    this.idToken = data.idToken;
    this.refreshToken = data.refreshToken;
    this.saveToStorage();

    return user;
  }

  async signOut(): Promise<void> {
    this.currentUser = null;
    this.idToken = null;
    this.refreshToken = null;
    this.saveToStorage();
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  async deleteUser(): Promise<void> {
    if (!this.idToken) throw new Error("Not authenticated");

    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:delete?key=${this.config.apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idToken: this.idToken,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Account deletion failed");
    }

    await this.signOut();
  }

  // Firestore REST API methods
  async addDocument(collection: string, data: any): Promise<string> {
    if (!this.idToken) throw new Error("Not authenticated");

    const response = await fetch(
      `https://firestore.googleapis.com/v1/projects/${this.config.projectId}/databases/(default)/documents/${collection}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.idToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: this.convertToFirestoreFields(data),
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          return this.addDocument(collection, data);
        }
      }
      throw new Error("Failed to add document");
    }

    const result = await response.json();
    return result.name.split("/").pop();
  }

  async getDocuments(
    collection: string,
    orderBy?: string,
    limit?: number
  ): Promise<any[]> {
    let url = `https://firestore.googleapis.com/v1/projects/${this.config.projectId}/databases/(default)/documents/${collection}`;

    const params = new URLSearchParams();
    if (orderBy) {
      params.append("orderBy", `${orderBy} desc`);
    }
    if (limit) {
      params.append("pageSize", limit.toString());
    }

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch documents");
    }

    const result = await response.json();
    return (result.documents || []).map((doc: any) => ({
      id: doc.name.split("/").pop(),
      ...this.convertFromFirestoreFields(doc.fields),
    }));
  }

  async queryDocuments(
    collection: string,
    field: string,
    operator: string,
    value: any
  ): Promise<any[]> {
    const response = await fetch(
      `https://firestore.googleapis.com/v1/projects/${this.config.projectId}/databases/(default)/documents:runQuery`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          structuredQuery: {
            from: [{ collectionId: collection }],
            where: {
              fieldFilter: {
                field: { fieldPath: field },
                op: operator.toUpperCase(),
                value: this.convertToFirestoreValue(value),
              },
            },
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to query documents");
    }

    const result = await response.json();
    return (result || [])
      .filter((item: any) => item.document)
      .map((item: any) => ({
        id: item.document.name.split("/").pop(),
        ...this.convertFromFirestoreFields(item.document.fields),
      }));
  }

  async deleteDocument(collection: string, docId: string): Promise<void> {
    if (!this.idToken) throw new Error("Not authenticated");

    const response = await fetch(
      `https://firestore.googleapis.com/v1/projects/${this.config.projectId}/databases/(default)/documents/${collection}/${docId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${this.idToken}`,
        },
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          return this.deleteDocument(collection, docId);
        }
      }
      throw new Error("Failed to delete document");
    }
  }

  // Storage methods
  async uploadFile(path: string, file: Blob): Promise<string> {
    if (!this.idToken) throw new Error("Not authenticated");

    const response = await fetch(
      `https://firebasestorage.googleapis.com/v0/b/${
        this.config.storageBucket
      }/o?uploadType=media&name=${encodeURIComponent(path)}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.idToken}`,
          "Content-Type": file.type || "application/octet-stream",
        },
        body: file,
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          return this.uploadFile(path, file);
        }
      }
      throw new Error("Failed to upload file");
    }

    const result = await response.json();
    return `https://firebasestorage.googleapis.com/v0/b/${
      this.config.storageBucket
    }/o/${encodeURIComponent(path)}?alt=media&token=${result.downloadTokens}`;
  }

  async deleteFile(path: string): Promise<void> {
    if (!this.idToken) throw new Error("Not authenticated");

    const response = await fetch(
      `https://firebasestorage.googleapis.com/v0/b/${
        this.config.storageBucket
      }/o/${encodeURIComponent(path)}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${this.idToken}`,
        },
      }
    );

    if (!response.ok && response.status !== 404) {
      if (response.status === 401) {
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          return this.deleteFile(path);
        }
      }
      throw new Error("Failed to delete file");
    }
  }

  private convertToFirestoreFields(obj: any): any {
    const fields: any = {};
    for (const [key, value] of Object.entries(obj)) {
      fields[key] = this.convertToFirestoreValue(value);
    }
    return fields;
  }

  private convertToFirestoreValue(value: any): any {
    if (value === null) return { nullValue: null };
    if (typeof value === "boolean") return { booleanValue: value };
    if (typeof value === "number") return { doubleValue: value };
    if (typeof value === "string") return { stringValue: value };
    if (value instanceof Date) return { timestampValue: value.toISOString() };
    if (Array.isArray(value)) {
      return {
        arrayValue: {
          values: value.map((v) => this.convertToFirestoreValue(v)),
        },
      };
    }
    if (typeof value === "object") {
      return {
        mapValue: {
          fields: this.convertToFirestoreFields(value),
        },
      };
    }
    return { stringValue: String(value) };
  }

  private convertFromFirestoreFields(fields: any): any {
    const obj: any = {};
    for (const [key, value] of Object.entries(fields)) {
      obj[key] = this.convertFromFirestoreValue(value);
    }
    return obj;
  }

  private convertFromFirestoreValue(value: any): any {
    if (value.nullValue !== undefined) return null;
    if (value.booleanValue !== undefined) return value.booleanValue;
    if (value.doubleValue !== undefined) return value.doubleValue;
    if (value.integerValue !== undefined) return parseInt(value.integerValue);
    if (value.stringValue !== undefined) return value.stringValue;
    if (value.timestampValue !== undefined)
      return new Date(value.timestampValue);
    if (value.arrayValue !== undefined) {
      return (
        value.arrayValue.values?.map((v: any) =>
          this.convertFromFirestoreValue(v)
        ) || []
      );
    }
    if (value.mapValue !== undefined) {
      return this.convertFromFirestoreFields(value.mapValue.fields || {});
    }
    return null;
  }
}

export const firebaseClient = new FirebaseRestClient(firebaseConfig);
