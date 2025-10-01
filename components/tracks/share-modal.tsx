'use client';

import { useState } from 'react';
import { X, Copy, Check, Facebook, Twitter, Linkedin, Mail, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  EmailShareButton,
} from 'react-share';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  trackId: string;
  trackTitle: string;
  trackUrl: string;
}

export function ShareModal({
  isOpen,
  onClose,
  trackId,
  trackTitle,
  trackUrl,
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [embedCode, setEmbedCode] = useState(
    `<iframe src="${trackUrl}/embed" width="100%" height="200" frameborder="0"></iframe>`
  );
  const [embedCopied, setEmbedCopied] = useState(false);

  if (!isOpen) return null;

  const copyToClipboard = async (text: string, type: 'link' | 'embed' = 'link') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'link') {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        setEmbedCopied(true);
        setTimeout(() => setEmbedCopied(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareText = `Check out this AI-generated track: ${trackTitle}`;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Share Track</h3>
            <p className="text-sm text-gray-600 mt-1">{trackTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Share Link */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Share Link
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={trackUrl}
                readOnly
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
              />
              <button
                onClick={() => copyToClipboard(trackUrl, 'link')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <Check size={18} />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy size={18} />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Share on Social Media
            </label>
            <div className="grid grid-cols-4 gap-3">
              <FacebookShareButton
                url={trackUrl}
                className="flex flex-col items-center gap-2 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white">
                  <Facebook size={24} />
                </div>
                <span className="text-sm font-medium text-gray-700">Facebook</span>
              </FacebookShareButton>

              <TwitterShareButton
                url={trackUrl}
                title={shareText}
                className="flex flex-col items-center gap-2 p-4 bg-sky-50 hover:bg-sky-100 rounded-lg transition-colors"
              >
                <div className="w-12 h-12 bg-sky-500 rounded-full flex items-center justify-center text-white">
                  <Twitter size={24} />
                </div>
                <span className="text-sm font-medium text-gray-700">Twitter</span>
              </TwitterShareButton>

              <LinkedinShareButton
                url={trackUrl}
                title={trackTitle}
                summary={shareText}
                className="flex flex-col items-center gap-2 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <div className="w-12 h-12 bg-blue-700 rounded-full flex items-center justify-center text-white">
                  <Linkedin size={24} />
                </div>
                <span className="text-sm font-medium text-gray-700">LinkedIn</span>
              </LinkedinShareButton>

              <EmailShareButton
                url={trackUrl}
                subject={`Check out: ${trackTitle}`}
                body={shareText}
                className="flex flex-col items-center gap-2 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center text-white">
                  <Mail size={24} />
                </div>
                <span className="text-sm font-medium text-gray-700">Email</span>
              </EmailShareButton>
            </div>
          </div>

          {/* QR Code */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                QR Code
              </label>
              <button
                onClick={() => setShowQR(!showQR)}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                <QrCode size={16} />
              </button>
            </div>
            {showQR && (
              <div className="flex justify-center p-6 bg-gray-50 rounded-lg">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <QRCodeSVG
                    value={trackUrl}
                    size={200}
                    level="H"
                    includeMargin
                  />
                  <p className="text-xs text-center text-gray-600 mt-2">
                    Scan to listen
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Embed Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Embed Code
            </label>
            <div className="space-y-2">
              <textarea
                value={embedCode}
                readOnly
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm font-mono"
              />
              <button
                onClick={() => copyToClipboard(embedCode, 'embed')}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
              >
                {embedCopied ? (
                  <>
                    <Check size={18} />
                    Embed Code Copied!
                  </>
                ) : (
                  <>
                    <Copy size={18} />
                    Copy Embed Code
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Privacy Notice */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              <strong>Note:</strong> Anyone with this link can listen to your track. 
              Make sure you&apos;re comfortable sharing it publicly.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
