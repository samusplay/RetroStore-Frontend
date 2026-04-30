"use client";
import ProductForm from "@/app/components/forms/ProductForm";
import RegisterForm from "@/app/components/forms/RegisterForm";
import LoginForm from "@/app/components/forms/LoginForm";

export default function TestForms() {
  return (
    <div>
      <LoginForm />
      <RegisterForm />
      <ProductForm />
    </div>
  );
}