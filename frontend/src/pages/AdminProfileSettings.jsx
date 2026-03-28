import React, { useState, useEffect } from 'react';
import { User, Mail, Building, Linkedin, Globe, Save } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import API_URL from "../api";

const AdminProfileSettings = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    institutionName: '',
    companyWebsite: '',
    linkedinId: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const adminData = JSON.parse(localStorage.getItem('user')) || {};
      setProfile({
        name: adminData.name || 'Admin User',
        email: adminData.email || 'admin@cloudservices.inc',
        institutionName: adminData.institutionName || 'Cloud Services Inc.',
        companyWebsite: adminData.companyWebsite || 'www.cloudservices.inc',
        linkedinId: adminData.linkedinId || ''
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
          role: 'admin',
          name: profile.name,
          institutionName: profile.institutionName,
          companyWebsite: profile.companyWebsite,
          linkedinId: profile.linkedinId
        })
      });

      if (response.ok) {
        const updatedUser = await response.json();
        localStorage.setItem('user', JSON.stringify(updatedUser)); // Centralized global tracking scope!
        
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
        <h1 className="text-3xl font-bold mb-2 text-main" style={{ fontFamily: 'Outfit, sans-serif' }}>Admin Profile Settings</h1>
        <p className="text-muted">Manage the underlying organizational details used for generated certificates.</p>
      </div>
      
      <Card style={{ padding: '2rem', background: 'white', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-2xl)', boxShadow: 'var(--shadow-sm)' }}>
        <form onSubmit={handleSave} className="flex flex-col gap-6">
          
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-sm text-muted flex items-center gap-2">
              <Building size={16} /> Institution / Company Name
            </label>
            <Input 
              name="institutionName" 
              value={profile.institutionName} 
              onChange={handleChange} 
              required 
              placeholder="e.g. Cloud Services Inc."
              style={{ fontSize: '1rem', padding: '0.75rem' }}
            />
            <p className="text-xs text-muted mt-1">This exact name will be prominently verified and printed on all generated certificates.</p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-semibold text-sm text-muted flex items-center gap-2">
              <User size={16} /> Admin Name
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
              <Mail size={16} /> Official Email Address
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
              <Globe size={16} /> Company Website
            </label>
            <Input 
              name="companyWebsite" 
              value={profile.companyWebsite} 
              onChange={handleChange} 
              placeholder="e.g. https://www."
              style={{ fontSize: '1rem', padding: '0.75rem' }}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-semibold text-sm text-muted flex items-center gap-2">
              <Linkedin size={16} /> Organization LinkedIn Profile
            </label>
            <Input 
              name="linkedinId" 
              value={profile.linkedinId} 
              onChange={handleChange} 
              placeholder="e.g. cloud-services-inc"
              style={{ fontSize: '1rem', padding: '0.75rem' }}
            />
          </div>

          <div className="pt-4 border-t mt-4 flex items-center justify-between" style={{ borderColor: 'var(--border-color)' }}>
            {saved ? (
              <span className="text-success font-medium flex items-center gap-2"><Save size={18} /> Settings saved successfully!</span>
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

export default AdminProfileSettings;
