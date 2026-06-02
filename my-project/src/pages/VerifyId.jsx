import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  ShieldX,
  GraduationCap,
  Mail,
  Phone,
  Calendar,
} from "lucide-react";
import { idCardAPI } from "../services/api";
import MemberPhoto from "../components/MemberPhoto";

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function VerifyId() {
  const { code } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verify = async () => {
      if (!code) {
        setResult({ valid: false, message: "No ID code provided" });
        setLoading(false);
        return;
      }

      try {
        const res = await idCardAPI.verify(code);
        setResult(res.data);
      } catch (err) {
        setResult({
          valid: false,
          message:
            err.response?.data?.message ||
            "Verification failed. Check the code and try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [code]);

  const valid = result?.valid;
  const data = result?.data;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto"
      >
        <div className="text-center mb-6">
          <img
            src="/logo.png"
            alt="NUNA"
            className="h-14 w-14 mx-auto object-contain mb-2"
          />
          <h1 className="text-xl font-bold text-gray-900">NUNA ID Verification</h1>
          <p className="text-sm text-gray-500 font-mono mt-1">{code}</p>
        </div>

        {loading && (
          <div className="bg-white rounded-2xl shadow p-8 text-center text-gray-500">
            Verifying membership...
          </div>
        )}

        {!loading && result && (
          <div
            className={`rounded-2xl shadow-lg overflow-hidden border-2 ${
              valid ? "border-green-500" : "border-red-400"
            }`}
          >
            <div
              className={`px-6 py-5 text-white flex items-center gap-3 ${
                valid ? "bg-green-600" : "bg-red-500"
              }`}
            >
              {valid ? (
                <ShieldCheck size={36} />
              ) : (
                <ShieldX size={36} />
              )}
              <div>
                <p className="font-bold text-lg">
                  {valid ? "Verified member" : "Not verified"}
                </p>
                <p className="text-sm opacity-90">{result.message}</p>
              </div>
            </div>

            {valid && data && (
              <div className="bg-white p-6 space-y-3 text-sm">
                <div className="flex flex-col items-center gap-3 pb-3 border-b border-gray-100">
                  <MemberPhoto
                    name={data.name}
                    profileImage={data.profileImage}
                    size="lg"
                    className="!rounded-full border-2 border-green-200"
                  />
                  <span className="font-semibold text-base text-gray-900">
                    {data.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <GraduationCap size={18} className="text-blue-600 shrink-0" />
                  <span>
                    {data.matricNumber} · {data.level}
                  </span>
                </div>
                <p className="text-gray-600 pl-7">{data.department}</p>
                {data.email && (
                  <div className="flex items-center gap-2 text-gray-600 pl-1">
                    <Mail size={16} className="text-gray-400" />
                    {data.email}
                  </div>
                )}
                {data.phone && (
                  <div className="flex items-center gap-2 text-gray-600 pl-1">
                    <Phone size={16} className="text-gray-400" />
                    {data.phone}
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-500 text-xs pt-2 border-t">
                  <Calendar size={14} />
                  ID issued {formatDate(data.issuedAt)} · Checked{" "}
                  {formatDate(data.verifiedAt)}
                </div>
              </div>
            )}

            {!valid && (
              <div className="bg-white p-6 text-sm text-gray-600">
                <p>
                  This QR code could be invalid, revoked, or not registered with
                  the Njala University Nurses Association portal.
                </p>
                {data?.matricNumber && (
                  <p className="mt-2 font-mono text-gray-800">
                    Matric: {data.matricNumber}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        <p className="text-center mt-6 text-sm text-gray-500">
          <Link to="/" className="text-blue-600 hover:underline">
            Back to portal
          </Link>
          {" · "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Student login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
