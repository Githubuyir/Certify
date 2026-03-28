import React, { useState, useEffect } from 'react';
import { User, Mail, Linkedin, Save } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import API_URL from "../api";

const ProfileSettings = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    institution: '',
    linkedinId: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user')) || {};
      setProfile({
        name: user.name || 'Steven Abraham',
        email: user.email || 'steven@university.edu',
        linkedinId: user.linkedinId || ''
      });
    } catch(e) { console.error(e) }
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
    setSaved(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const user = JSON.parse(localStorage.getItem('user')) || {};
      const response = await fetch('${API_URL}/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          _id: user._id,
          email: profile.email,
          role: 'student',
          name: profile.name,
          linkedinId: profile.linkedinId
        })
      });

      if (response.ok) {
        const updatedUser = await response.json();
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        window.dispatchEvent(new Event('profileUpdated'));
        
        setIsSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
         setIsSaving(false);
      }
    } catch(err) {
      console.error(err);
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6 animate-fade-in-up">
      <div className="mb-8" style={{ paddingLeft: '0.5rem' }}>
        <h1 className="text-3xl font-bold mb-2 text-main" style={{ fontFamily: 'Outfit, sans-serif' }}>Profile Settings</h1>
        <p className="text-muted">Manage your personal details and connected accounts.</p>
      </div>
      
      <Card style={{ padding: '2rem', background: 'white', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-2xl)', boxShadow: 'var(--shadow-sm)' }}>
        <form onSubmit={handleSave} className="flex flex-col gap-6">
          
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-sm text-muted flex items-center gap-2">
              <User size={16} /> Full Name
            </label>
            <Input 
              name="name" 
              value={profile.name} 
              onChange={handleChange} 
              required 
              style={{ fontSize: '1rem', padding: '0.75rem' }}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-semibold text-sm text-muted flex items-center gap-2">
              <Mail size={16} /> Email Address
            </label>
            <Input 
              type="email" 
              name="email" 
              value={profile.email} 
              onChange={handleChange} 
              required 
              style={{ fontSize: '1rem', padding: '0.75rem' }}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-semibold text-sm text-muted flex items-center gap-2">
              <Linkedin size={16} /> LinkedIn Profile ID
            </label>
            <Input 
              name="linkedinId" 
              value={profile.linkedinId} 
              onChange={handleChange} 
              placeholder="e.g. steven-abraham"
              style={{ fontSize: '1rem', padding: '0.75rem' }}
            />
            <p className="text-xs text-muted mt-1">Required for 1-click certificate sharing to LinkedIn.</p>
          </div>

          <div className="pt-4 border-t mt-4 flex items-center justify-between" style={{ borderColor: 'var(--border-color)' }}>
            {saved ? (
              <span className="text-success font-medium flex items-center gap-2"><Save size={18} /> Settings saved!</span>
            ) : <span></span>}
            
            <Button type="submit" variant="primary" disabled={isSaving} className="py-3 px-8">
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
          
        </form>
      </Card>
    </div>
  );
};

export default ProfileSettings;
