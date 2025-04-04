
import React from 'react';
import { Link } from 'react-router-dom';

interface CreateAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function CreateAccountModal({ isOpen, onClose }: CreateAccountModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-xl font-bold mb-4 text-center">Create Your Account</h2>
        <p className="text-gray-600 text-sm mb-6 text-center">
          Unlock full carrier details like phone, MC, DOT number and more.
        </p>
        <div className="flex flex-col gap-4">
          <Link
            to="/auth?mode=register"
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-center"
          >
            Create Account
          </Link>
          <button
            onClick={onClose}
            className="text-blue-500 hover:underline text-sm"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateAccountModal;
