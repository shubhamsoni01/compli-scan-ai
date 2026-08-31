import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Camera, Trash2, Moon, Sun, Monitor, Bell, Globe, Shield, Download, LogOut, Check, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { API_BASE_URL } from '@/services/api';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user, logout, refreshUser, updateUser } = useAuth();
  
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [notifications, setNotifications] = useState(true);
  const [analytics, setAnalytics] = useState(false);

  const [name, setName] = useState(user?.name || '');
  const [isSavingName, setIsSavingName] = useState(false);
  const [nameError, setNameError] = useState('');
  const [nameSuccess, setNameSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState('');
  const [photoSuccess, setPhotoSuccess] = useState(false);

  // Delete Photo Modal State
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeletingPhoto, setIsDeletingPhoto] = useState(false);

  useEffect(() => {
    if (user?.name) setName(user.name);
  }, [user]);

  // Compute initials based on real user name (e.g. "Shubham Kumar" -> "SK")
  const getInitials = (fullName?: string) => {
    if (!fullName || !fullName.trim()) return 'CS';
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const initials = getInitials(user?.name);
  const currentPhotoUrl = user?.profilePhotoUrl || user?.profilePicture;

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhotoError('');
    setPhotoSuccess(false);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      setPhotoError('Please select a valid image file (JPG, PNG, or WEBP).');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setPhotoError('Image size is too large. Maximum allowed size is 5MB.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setSelectedFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const cancelPhoto = () => {
    setSelectedFile(null);
    setPhotoPreview(null);
    setPhotoError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const savePhoto = async () => {
    if (!selectedFile) return;
    setIsUploadingPhoto(true);
    setPhotoError('');
    setPhotoSuccess(false);

    try {
      const formData = new FormData();
      formData.append('photo', selectedFile);

      const token = localStorage.getItem('compliscan_jwt');
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${API_BASE_URL}/api/auth/profile/photo`, {
        method: 'PATCH',
        headers,
        credentials: 'include',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to upload photo. Please select a valid image.');
      }

      if (data.user) {
        updateUser(data.user);
      } else {
        await refreshUser();
      }

      setPhotoSuccess(true);
      setTimeout(() => setPhotoSuccess(false), 3000);
      cancelPhoto();
    } catch (err: any) {
      setPhotoError(err.message || 'Failed to upload profile photo.');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleDeletePhoto = async () => {
    setIsDeletingPhoto(true);
    setPhotoError('');
    try {
      const token = localStorage.getItem('compliscan_jwt');
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${API_BASE_URL}/api/auth/profile/photo`, {
        method: 'DELETE',
        headers,
        credentials: 'include',
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to remove profile photo.');
      }

      if (data.user) {
        updateUser(data.user);
      } else {
        await refreshUser();
      }

      cancelPhoto();
      setIsDeleteDialogOpen(false);
      setPhotoSuccess(true);
      setTimeout(() => setPhotoSuccess(false), 3000);
    } catch (err: any) {
      setPhotoError(err.message || 'Failed to remove profile photo.');
    } finally {
      setIsDeletingPhoto(false);
    }
  };

  const saveName = async () => {
    if (!name.trim()) {
      setNameError('Name cannot be empty.');
      return;
    }
    setIsSavingName(true);
    setNameError('');
    setNameSuccess(false);

    try {
      const token = localStorage.getItem('compliscan_jwt');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        method: 'PATCH',
        headers,
        credentials: 'include',
        body: JSON.stringify({ name }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update name.');
      }

      if (data.user) {
        updateUser(data.user);
      } else {
        await refreshUser();
      }

      setNameSuccess(true);
      setTimeout(() => setNameSuccess(false), 3000);
    } catch (err: any) {
      setNameError(err.message || 'Failed to update profile name.');
    } finally {
      setIsSavingName(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const formatDate = (dateString?: string | Date) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-heading text-slate-900 dark:text-white mb-2">Settings</h1>
        <p className="text-slate-600 dark:text-slate-400">Manage your account preferences and application settings.</p>
      </div>

      {/* Profile Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-200">Profile</h2>
        <Card className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-6">
            <div className="relative group flex-shrink-0">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white dark:border-slate-800 shadow-md bg-indigo-600 flex items-center justify-center text-white text-3xl font-bold select-none">
                {photoPreview ? (
                  <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : currentPhotoUrl ? (
                  <img 
                    src={currentPhotoUrl} 
                    alt={user?.name || 'User'} 
                    className="w-full h-full object-cover" 
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  initials
                )}
              </div>
              <button
                type="button"
                onClick={handlePhotoClick}
                className="absolute bottom-0 right-0 p-2 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 transition-colors cursor-pointer"
                title="Change Photo"
              >
                <Camera size={16} />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileChange}
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white truncate">{user?.name}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                <span className="truncate">{user?.email}</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 flex-shrink-0">
                  {user?.authProvider === 'google' ? 'Google' : 'Email'}
                </span>
              </p>

              {/* Action Buttons: Change Photo & Remove Photo */}
              <div className="flex flex-wrap items-center gap-2.5 mt-3">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handlePhotoClick}
                  type="button"
                >
                  <Camera size={14} className="mr-1.5" />
                  Change Photo
                </Button>

                {currentPhotoUrl && !photoPreview && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setIsDeleteDialogOpen(true)}
                    type="button"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 dark:text-red-400 dark:hover:bg-red-950/30 dark:border-red-900/40"
                  >
                    <Trash2 size={14} className="mr-1.5" />
                    Remove Photo
                  </Button>
                )}
              </div>
              
              {photoPreview && (
                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="primary" onClick={savePhoto} isLoading={isUploadingPhoto}>Save Photo</Button>
                  <Button size="sm" variant="outline" onClick={cancelPhoto} disabled={isUploadingPhoto}>Cancel</Button>
                </div>
              )}

              {photoError && (
                <p className="text-xs text-red-500 flex items-center gap-1 mt-2">
                  <AlertCircle size={13} /> {photoError}
                </p>
              )}

              {photoSuccess && (
                <p className="text-xs text-green-500 flex items-center gap-1 mt-2">
                  <Check size={13} /> Profile photo updated successfully!
                </p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <Input 
                label="Full Name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                id="fullName" 
              />
              {nameError && <p className="text-xs text-red-500">{nameError}</p>}
              {nameSuccess && <p className="text-xs text-green-500 flex items-center gap-1"><Check size={12}/> Saved</p>}
            </div>
            <div>
              <Input 
                label="Email Address" 
                type="email" 
                value={user?.email || ''} 
                disabled 
                id="email" 
              />
              <p className="text-[10px] text-slate-500 mt-1">Email cannot be changed.</p>
            </div>
            <Input label="Role" value={user?.role || 'Compliance Inspector'} disabled id="role" />
            <Input label="Organization" value={user?.organization || 'N/A'} disabled id="org" />
            <Input label="Member Since" value={formatDate(user?.createdAt)} disabled id="createdAt" />
          </div>
          
          <div className="flex justify-end pt-4">
            <Button onClick={saveName} isLoading={isSavingName} disabled={name === user?.name}>Save Name</Button>
          </div>
        </Card>
      </section>

      {/* Preferences Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-200">Preferences</h2>
        <Card className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Theme</label>
            <div className="flex space-x-3">
              <button 
                onClick={() => setTheme('light')}
                className={`flex items-center px-4 py-2 rounded-lg border ${theme === 'light' ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-700 dark:text-indigo-300' : 'bg-white border-slate-200 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'}`}
              >
                <Sun className="h-4 w-4 mr-2" /> Light
              </button>
              <button 
                onClick={() => setTheme('dark')}
                className={`flex items-center px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-700 dark:text-indigo-300' : 'bg-white border-slate-200 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'}`}
              >
                <Moon className="h-4 w-4 mr-2" /> Dark
              </button>
              <button 
                onClick={() => setTheme('system')}
                className={`flex items-center px-4 py-2 rounded-lg border ${theme === 'system' ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-700 dark:text-indigo-300' : 'bg-white border-slate-200 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'}`}
              >
                <Monitor className="h-4 w-4 mr-2" /> System
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center">
              <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg mr-4">
                <Bell className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              </div>
              <div>
                <h3 className="font-medium">Notifications</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Receive alerts for completed scans</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={notifications} onChange={() => setNotifications(!notifications)} />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-indigo-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center">
              <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg mr-4">
                <Globe className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              </div>
              <div>
                <h3 className="font-medium">Language</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Select application language</p>
              </div>
            </div>
            <select className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500">
              <option value="en">English</option>
              <option value="hi">Hindi</option>
            </select>
          </div>
        </Card>
      </section>

      {/* Privacy Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-200">Privacy & Data</h2>
        <Card className="p-6 space-y-6">
          <div className="flex items-start">
            <Shield className="h-5 w-5 text-indigo-500 mt-0.5 mr-3" />
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Privacy Assurance</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Personal scan history is visible only to you. Your data is encrypted at rest.</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between py-2 border-t border-slate-100 dark:border-slate-800 pt-4">
            <div>
              <h3 className="font-medium">Anonymous Analytics</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Allow anonymous usage analytics to improve our service</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={analytics} onChange={() => setAnalytics(!analytics)} />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" className="flex items-center justify-center">
              <Download className="h-4 w-4 mr-2" /> Export My Data
            </Button>
            <Button variant="danger" className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white">
              <Trash2 className="h-4 w-4 mr-2" /> Delete Scan History
            </Button>
          </div>
        </Card>
      </section>

      {/* Account Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-200">Account</h2>
        <Card className="p-6">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            Logging out will end your current session and require you to sign in again.
          </p>
          <Button onClick={handleLogout} variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 dark:text-red-400 dark:hover:bg-red-900/20 dark:border-red-900/50">
            <LogOut className="h-4 w-4 mr-2" /> Logout
          </Button>
        </Card>
      </section>

      {/* Remove Photo Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeletePhoto}
        title="Remove Profile Photo"
        message="Remove your profile photo? Your profile will display your initials avatar instead."
        confirmLabel="Remove Photo"
        cancelLabel="Cancel"
        isDanger={true}
        isLoading={isDeletingPhoto}
      />
    </div>
  );
}
