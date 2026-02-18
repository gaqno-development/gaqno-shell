import { useState, useEffect } from "react";
import { useProfile } from "./useProfile";

export type ProfileFormMessage = {
  type: "success" | "error";
  text: string;
} | null;

export function useProfileForm() {
  const { user, isLoading, error, updateProfile } = useProfile();
  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [avatar, setAvatar] = useState(user?.avatar ?? "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<ProfileFormMessage>(null);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName ?? "");
      setLastName(user.lastName ?? "");
      setPhone(user.phone ?? "");
      setAvatar(user.avatar ?? "");
    }
  }, [user]);

  const handleSubmitProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setSaving(true);
    try {
      await updateProfile({
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        phone: phone || undefined,
        avatar: avatar || undefined,
      });
      setMessage({ type: "success", text: "Perfil atualizado." });
    } catch {
      setMessage({
        type: "error",
        text: "Não foi possível atualizar o perfil.",
      });
    } finally {
      setSaving(false);
    }
  };

  return {
    user,
    isLoading,
    error,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    phone,
    setPhone,
    avatar,
    setAvatar,
    saving,
    message,
    handleSubmitProfile,
  };
}
