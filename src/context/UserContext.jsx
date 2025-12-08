import React, { createContext, useState, useEffect, useRef } from "react";
import axios from "axios";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const cancelSourceRef = useRef(null);
  const isMounted = useRef(true);

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  // 🔄 Fetch user once on mount (if needed)
  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (!user && email) {
      fetchUserDetails(email);
    }
    return () => {
      isMounted.current = false;
      if (cancelSourceRef.current) {
        cancelSourceRef.current.cancel("Request cancelled on unmount/logout");
      }
    };
  }, []); // ✅ stable effect, runs only once

  // 💾 Save/remove storage when user changes
  useEffect(() => {
    if (!isMounted.current) return;

    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      if (user.email) {
        localStorage.setItem("userEmail", user.email);
      }
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("userEmail");
      if (cancelSourceRef.current) {
        cancelSourceRef.current.cancel("Request cancelled on logout");
      }
    }
  }, [user]); // ✅ dependency is stable state, not storage

  const fetchUserDetails = async (email) => {
    if (!isMounted.current) return;

    try {
      // Cancel previous pending request if exists
      if (cancelSourceRef.current) {
        cancelSourceRef.current.cancel("Cancelled previous request");
      }

      const source = axios.CancelToken.source();
      cancelSourceRef.current = source;

      const res = await axios.get(
        "http://localhost:9090/api/staff/email/" + email,
        { cancelToken: source.token }
      );

      if (isMounted.current) {
        setUser(res.data);
      }
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log("fetchUserDetails: request cancelled");
      } else {
        console.error("Error fetching user:", err);
        if (isMounted.current) setUser(null);
      }
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, fetchUserDetails }}>
      {children}
    </UserContext.Provider>
  );
};
