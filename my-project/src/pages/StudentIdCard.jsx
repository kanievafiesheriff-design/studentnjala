import React, { useCallback, useEffect, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  CreditCard,
  RefreshCw,
  ShieldCheck,
  Download,
  User,
  Camera,
  Save,
  IdCard,
} from "lucide-react";
import { useStudent } from "../context/StudentContext";
import { idCardAPI } from "../services/api";
import MemberPhoto from "../components/MemberPhoto";

const LEVELS = ["Year 1", "Year 2", "Year 3", "Year 4"];

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function StudentIdCard() {
  const { student, updateProfile, uploadProfilePhoto } = useStudent();
  const [card, setCard] = useState(null);
  const [loadingCard, setLoadingCard] = useState(true);
  const [error, setError] = useState("");
  const [regenerating, setRegenerating] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");
  const [photoPreview, setPhotoPreview] = useState(null);
  const cardRef = useRef(null);
  const fileInputRef = useRef(null);

  const [profileForm, setProfileForm] = useState({
    name: "",
    phone: "",
    level: "Year 1",
    department: "BSc Nursing",
  });

  useEffect(() => {
    if (student) {
      setProfileForm({
        name: student.fullName || "",
        phone: student.phone || "",
        level: student.yearLevel || "Year 1",
        department: student.department || "BSc Nursing",
      });
      setPhotoPreview(student.profileImage || null);
    }
  }, [student]);

  const loadCard = useCallback(async () => {
    setError("");
    setLoadingCard(true);
    try {
      const res = await idCardAPI.getMine();
      setCard(res.data.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not load your digital ID. Save your profile and try again."
      );
    } finally {
      setLoadingCard(false);
    }
  }, []);

  useEffect(() => {
    loadCard();
  }, [loadCard]);

  const handleProfileChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  const handlePhotoSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setProfileMsg("Please choose an image file (JPG, PNG, or WebP).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setProfileMsg("Image must be 5MB or smaller.");
      return;
    }

    setProfileMsg("");
    setUploadingPhoto(true);
    setPhotoPreview(URL.createObjectURL(file));

    try {
      await uploadProfilePhoto(file);
      setProfileMsg("Photo uploaded. Your digital ID is updated.");
      await loadCard();
    } catch (err) {
      setProfileMsg(err.message);
      setPhotoPreview(student?.profileImage || null);
    } finally {
      setUploadingPhoto(false);
      e.target.value = "";
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg("");
    try {
      await updateProfile({
        name: profileForm.name.trim(),
        phone: profileForm.phone.trim(),
        level: profileForm.level,
        department: profileForm.department.trim(),
      });
      setProfileMsg("Profile saved. Scroll down to view your digital ID.");
      await loadCard();
    } catch (err) {
      setProfileMsg(err.message);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleRegenerate = async () => {
    if (
      !window.confirm(
        "Generate a new QR code? Old codes will stop working immediately."
      )
    ) {
      return;
    }
    setRegenerating(true);
    try {
      const res = await idCardAPI.regenerate();
      setCard(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to regenerate ID");
    } finally {
      setRegenerating(false);
    }
  };

  const handleDownloadQr = () => {
    const svg = cardRef.current?.querySelector("svg");
    if (!svg || !card) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      canvas.width = 280;
      canvas.height = 280;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, 280, 280);
      const link = document.createElement("a");
      link.download = `NUNA-ID-QR-${card.member.matricNumber}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const member = card?.member;
  const displayPhoto = member?.profileImage || photoPreview || student?.profileImage;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 pt-24 pb-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <CreditCard className="text-blue-700" size={28} />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Member profile & digital ID
            </h1>
            <p className="text-sm text-gray-600">
              Upload your photo and details, then generate your NUNA ID with QR
              verification
            </p>
          </div>
        </div>

        {/* Profile section */}
        <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <User className="text-blue-600" size={22} />
            <h2 className="text-lg font-semibold text-gray-900">
              Step 1 — Your information
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 mb-6">
            <div className="flex flex-col items-center gap-3">
              <MemberPhoto
                name={profileForm.name}
                profileImage={displayPhoto}
                size="xl"
                className="!rounded-full border-4 border-blue-100"
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handlePhotoSelect}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingPhoto}
                className="inline-flex items-center gap-2 text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <Camera size={16} />
                {uploadingPhoto ? "Uploading..." : "Upload photo"}
              </button>
              <p className="text-xs text-gray-500 text-center max-w-[140px]">
                Passport-style photo for your ID card
              </p>
            </div>

            <form onSubmit={handleSaveProfile} className="flex-1 space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Full name
                </label>
                <input
                  name="name"
                  value={profileForm.name}
                  onChange={handleProfileChange}
                  required
                  className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Matric number
                  </label>
                  <input
                    value={student?.studentId || ""}
                    disabled
                    className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Email
                  </label>
                  <input
                    value={student?.email || ""}
                    disabled
                    className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Year level
                  </label>
                  <select
                    name="level"
                    value={profileForm.level}
                    onChange={handleProfileChange}
                    className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {LEVELS.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Phone
                  </label>
                  <input
                    name="phone"
                    value={profileForm.phone}
                    onChange={handleProfileChange}
                    placeholder="+232 76 000 000"
                    className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Department
                </label>
                <input
                  name="department"
                  value={profileForm.department}
                  onChange={handleProfileChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                disabled={savingProfile}
                className="inline-flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-lg hover:bg-emerald-700 text-sm font-medium disabled:opacity-50"
              >
                <Save size={18} />
                {savingProfile ? "Saving..." : "Save information"}
              </button>
            </form>
          </div>

          {profileMsg && (
            <p
              className={`text-sm p-3 rounded-lg ${
                profileMsg.includes("Could not") || profileMsg.includes("must")
                  ? "bg-red-50 text-red-700"
                  : "bg-green-50 text-green-800"
              }`}
            >
              {profileMsg}
            </p>
          )}
        </section>

        {/* Digital ID section */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <IdCard className="text-blue-600" size={22} />
            <h2 className="text-lg font-semibold text-gray-900">
              Step 2 — Digital NUNA ID & QR
            </h2>
          </div>

          {loadingCard && (
            <p className="text-center text-gray-500 py-8">Generating your ID...</p>
          )}

          {error && !loadingCard && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-4">
              {error}
            </div>
          )}

          {card && member && !loadingCard && (
            <>
              <div
                ref={cardRef}
                className="rounded-2xl overflow-hidden shadow-xl border border-blue-100 bg-white max-w-md mx-auto"
              >
                <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white px-5 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src="/logo.png"
                      alt="NUNA"
                      className="h-12 w-12 object-contain bg-white/10 rounded-full p-1"
                    />
                    <div>
                      <p className="text-xs uppercase tracking-wider opacity-90">
                        Njala University Nurses Association
                      </p>
                      <p className="font-bold text-lg">Student Member ID</p>
                    </div>
                  </div>
                </div>

                <div className="p-5 flex gap-4">
                  <MemberPhoto
                    name={member.name}
                    profileImage={displayPhoto}
                    size="md"
                  />
                  <div className="flex-1 min-w-0 text-sm space-y-1">
                    <p className="text-lg font-bold text-gray-900 truncate">
                      {member.name}
                    </p>
                    <p>
                      <span className="text-gray-500">Matric:</span>{" "}
                      <span className="font-mono font-semibold">
                        {member.matricNumber}
                      </span>
                    </p>
                    <p>
                      <span className="text-gray-500">Level:</span>{" "}
                      {member.level}
                    </p>
                    <p>
                      <span className="text-gray-500">Dept:</span>{" "}
                      {member.department}
                    </p>
                    {member.phone && (
                      <p>
                        <span className="text-gray-500">Phone:</span>{" "}
                        {member.phone}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 pt-1">
                      Issued {formatDate(card.issuedAt)}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-2 flex flex-col items-center border-t border-gray-100 pt-4">
                  <QRCodeSVG
                    value={card.verifyUrl}
                    size={180}
                    level="H"
                    includeMargin
                    aria-label="QR code for ID verification"
                  />
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Scan to verify membership
                  </p>
                  <p className="font-mono text-xs text-blue-800 mt-1">
                    {card.code}
                  </p>
                </div>

                <div className="bg-gray-50 px-5 py-3 flex items-center justify-center gap-2 text-xs text-gray-600 border-t">
                  <ShieldCheck size={14} className="text-green-600" />
                  Valid while membership is active · Bo Campus
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3 justify-center">
                <button
                  type="button"
                  onClick={handleDownloadQr}
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium"
                >
                  <Download size={18} />
                  Download QR
                </button>
                <button
                  type="button"
                  onClick={handleRegenerate}
                  disabled={regenerating}
                  className="inline-flex items-center gap-2 border border-gray-300 bg-white px-4 py-2 rounded-lg hover:bg-gray-50 text-sm font-medium disabled:opacity-50"
                >
                  <RefreshCw
                    size={18}
                    className={regenerating ? "animate-spin" : ""}
                  />
                  New QR code
                </button>
              </div>

              <p className="text-center text-xs text-gray-500 mt-4 max-w-md mx-auto">
                Anyone scanning your QR sees your photo and details on the
                verification page. Code:{" "}
                <span className="font-mono text-blue-700">{card.code}</span>
              </p>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
