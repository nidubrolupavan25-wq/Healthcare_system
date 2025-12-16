import React, { useEffect, useRef, useState } from "react";

export default function AuthModal({ show, onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState("");
  const [otpVisible, setOtpVisible] = useState(false);
  const captchaCanvasRef = useRef(null);

  useEffect(() => {
    if (show && isLogin) generateCaptcha();
    // eslint-disable-next-line
  }, [show, isLogin]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.flatpickr) {
      try {
        window.flatpickr("#dob", { dateFormat: "Y-m-d", maxDate: "today" });
      } catch (e) {}
    }
  }, []);

  function generateCaptcha() {
    const canvas = captchaCanvasRef.current || document.getElementById("captchaCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#f0f0f0";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = "24px Arial";
    ctx.fillStyle = "#000";
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let captcha = "";
    for (let i = 0; i < 6; i++) {
      captcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    ctx.fillText(captcha, 20, 40);
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }
    canvas.dataset.captcha = captcha;
  }

  function handleSubmit() {
    if (isLogin) {
      const email = document.getElementById("email")?.value;
      const password = document.getElementById("password")?.value;
      const captchaInput = document.getElementById("captchaInput")?.value;
      const correct = (captchaCanvasRef.current || document.getElementById("captchaCanvas"))?.dataset?.captcha;
      if (!email || !password || !captchaInput) {
        setMessage("Please fill all fields.");
        return;
      }
      if (captchaInput !== correct) {
        setMessage("Invalid CAPTCHA.");
        generateCaptcha();
        return;
      }
      setMessage("Login successful!");
      setTimeout(() => { setMessage(""); onClose(); }, 1000);
    } else {
      const firstName = document.getElementById("firstName")?.value;
      const lastName = document.getElementById("lastName")?.value;
      const gender = document.getElementById("gender")?.value;
      const dob = document.getElementById("dob")?.value;
      const contact = document.getElementById("contact")?.value;
      const email = document.getElementById("email")?.value;
      const password = document.getElementById("password")?.value;
      if (!firstName || !lastName || !gender || !dob || !contact || !email || !password) {
        setMessage("Please fill all fields.");
        return;
      }
      setMessage("OTP sent to your email!");
      setOtpVisible(true);
      // Keep original UI flow (hiding/showing fields is done using DOM in original code)
    }
  }

  function verifyOtp() {
    const otp = document.getElementById("otpInput")?.value;
    if (!otp || otp.length !== 6) {
      setMessage("Please enter a valid 6-digit OTP.");
      return;
    }
    setMessage("Sign up successful!");
    setTimeout(() => { setMessage(""); onClose(); }, 1000);
  }

  function handleForgotPassword() {
    const email = document.getElementById("forgotEmail")?.value;
    if (!email) {
      setMessage("Please enter your email.");
      return;
    }
    setMessage("Reset link sent to your email!");
    setTimeout(() => {
      setMessage("");
      setIsLogin(true);
    }, 1000);
  }

  if (!show) return null;

  return (
    <div className="modal-lt" style={{ display: "flex" }}>
      <div className="modal-content-lt">
        <button className="close-button-lt" onClick={onClose}>×</button>
        <h2 id="formTitle">{isLogin ? "Login" : "Sign Up"}</h2>
        <div id="loginForm">

          <div id="extraFields" style={{ display: isLogin ? "none" : "block" }}>
            <div className="form-group-lt"><label>First Name</label><input type="text" id="firstName" /></div>
            <div className="form-group-lt"><label>Last Name</label><input type="text" id="lastName" /></div>
            <div className="form-group-lt"><label>Gender</label>
              <select id="gender">
                <option value="">Select</option><option>Male</option><option>Female</option><option>Other</option>
              </select>
            </div>
            <div className="form-group-lt"><label>Date of Birth</label><input type="text" id="dob" placeholder="Select DOB" /></div>
            <div className="form-group-lt"><label>Contact Number</label><input type="tel" id="contact" pattern="[0-9]{10}" /></div>
          </div>

          <div id="forgotPasswordSection" style={{ display: "none" }}>
            <div className="form-group-lt"><label>Email</label><input type="email" id="forgotEmail" /></div>
            <button onClick={handleForgotPassword}>Send Reset Link</button>
            <button onClick={() => {
              // back to login form
              document.getElementById("forgotPasswordSection").style.display = "none";
              document.getElementById("commonFields").style.display = "block";
              document.getElementById("captchaSection").style.display = "block";
              document.getElementById("loginLinks").style.display = "flex";
              document.getElementById("mainButton").style.display = "block";
              document.getElementById("toggleText").style.display = "block";
              setIsLogin(true);
            }}>Back to Login</button>
          </div>

          <div id="commonFields">
            <div className="form-group-lt"><label>Email</label><input type="email" id="email" /></div>
            <div className="form-group-lt"><label>Password</label><input type="password" id="password" /></div>
          </div>

          <div id="captchaSection" style={{ display: isLogin ? "block" : "none" }}>
            <canvas id="captchaCanvas" ref={captchaCanvasRef} width="200" height="60"></canvas>
            <input type="text" id="captchaInput" placeholder="Enter CAPTCHA" />
            <button type="button" className="captcha-refresh-lt" onClick={generateCaptcha}>Refresh</button>
          </div>

          <div className="links-lt" id="loginLinks" style={{ display: isLogin ? "flex" : "none" }}>
            <div className="checkbox-group-lt"><input type="checkbox" id="rememberMe" /><label htmlFor="rememberMe">Remember me</label></div>
            <span className="forgot-password-lt" onClick={() => {
              // show forgot password section (mirroring original)
              document.getElementById("commonFields").style.display = "none";
              document.getElementById("captchaSection").style.display = "none";
              document.getElementById("loginLinks").style.display = "none";
              (document.getElementById("forgotPasswordSection") || {}).style.display = "block";
              document.getElementById("formTitle").textContent = "Forgot Password";
              (document.getElementById("mainButton") || {}).style.display = "none";
              (document.getElementById("toggleText") || {}).style.display = "none";
            }}>Forgot Password?</span>
          </div>

          <div id="otpSection" style={{ display: otpVisible ? "block" : "none" }}>
            <div id="otpText"></div>
            <div className="form-group-lt"><input type="text" id="otpInput" maxLength="6" placeholder="Enter OTP" /></div>
            <button onClick={verifyOtp}>Verify OTP</button>
          </div>

          <button id="mainButton" onClick={handleSubmit}>{isLogin ? "Login" : "Sign Up"}</button>
          <div id="toggleText">Don't have an account? <button id="toggleForm" onClick={() => { setIsLogin(!isLogin); }}>{isLogin ? "Register" : "Login"}</button></div>
          <div id="message" style={{ color: "red" }}>{message}</div>
        </div>
      </div>
    </div>
  );
}
