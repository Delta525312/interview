import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getStyles } from '../../styles/Solution3/styles';
import { type ShortenedURL, type ManagedURL, type AuditLog} from '../../components/solution3/types';
import { Link, Copy, Zap, Shield, Globe, Sparkles, CheckCircle, AlertCircle, TrendingUp, Clock, ExternalLink, Edit, Trash2, BookOpen,  XCircle, Search } from 'lucide-react';
import { Rnd } from 'react-rnd';
import Swal from 'sweetalert2';
import { useTheme } from '../../contexts/ThemeContext'; 
// --- Interfaces & Constants ---
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const URLshortenPage: React.FC = () => {
    // --- HOOKS ---
    const { themeMode } = useTheme();
    const { t } = useTranslation();
    const styles = useMemo(() => getStyles(themeMode), [themeMode]);
    const usernameBg = themeMode === 'dark' ? '#1f2937' : '#fff';
    const usernameColor = themeMode === 'dark' ? '#fff' : '#222';
    const usernameInputBg = themeMode === 'dark' ? '#222' : '#fff';
    const usernameInputColor = themeMode === 'dark' ? '#fff' : '#222';
    const usernameInputBorder = themeMode === 'dark' ? '#444' : '#ccc';
    const [showAuth, setShowAuth] = useState(false);
    const [displayName, setDisplayName] = useState(() => localStorage.getItem('name') || '');
    const [isEditingName, setIsEditingName] = useState(false);

    // Redirect to auth if no accessToken or name
    useEffect(() => {
      const token = localStorage.getItem('accessToken');
      const name = localStorage.getItem('name');
      if (!token || !name) {
        setShowAuth(true);
      }
    }, []);

    // --- STATE MANAGEMENT ---
    const [token, setToken] = useState<string | null>(() => localStorage.getItem('accessToken'));
    const [nameInput, setNameInput] = useState<string>('');
    const [originalUrl, setOriginalUrl] = useState<string>('');
    const [shortenedUrl, setShortenedUrl] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isCopied, setIsCopied] = useState<string>('');
    const [recentUrls, setRecentUrls] = useState<ShortenedURL[]>([]);
    const [managedUrls, setManagedUrls] = useState<ManagedURL[]>([]);
    const [urlOrder, setUrlOrder] = useState<'timestamp' | 'mostclick'>('timestamp');
    // Helper: sort managedUrls according to urlOrder
    const getSortedManagedUrls = useCallback(() => {
        let arr = [...managedUrls];
        if (urlOrder === 'timestamp') {
            // No timestamp in ManagedURL, so sort by id (assuming id is monotonic, or fallback to original order)
            arr.sort((a, b) => {
                // If id is a UUID, fallback to original order (no sort)
                // If id is numeric or sortable, sort descending
                // Otherwise, do nothing
                return 0;
            });
        } else if (urlOrder === 'mostclick') {
            arr.sort((a, b) => (b.clicks ?? 0) - (a.clicks ?? 0));
        }
        return arr;
    }, [managedUrls, urlOrder]);
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
    const [isHovering, setIsHovering] = useState<string>('');
    const [activeTab, setActiveTab] = useState<'manage' | 'log'>('manage');
    const [editingUrlId, setEditingUrlId] = useState<string | null>(null);
    const [editingValue, setEditingValue] = useState<string>('');
    const [lookupKey, setLookupKey] = useState('');
    const [lookupResult, setLookupResult] = useState<ManagedURL | null>(null);
    const [isSecurityModalOpen, setSecurityModalOpen] = useState(false);
    const [isLookupModalOpen, setIsLookupModalOpen] = useState(false);

    // --- API FUNCTIONS ---
    const getAuthHeaders = useCallback(() => {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    }, [token]);

    const handleApiResponse = async (response: Response) => {
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ detail: 'An unknown API error occurred.' }));
            throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
        }
        return response.json();
    };
    const handleCancelEdit = () => {
        setEditingUrlId(null);
        setEditingValue('');
    };
    // ตรวจสอบว่าคุณได้ import useTranslation hook มาแล้วในคอมโพเนนต์ของคุณ
// import { useTranslation } from 'react-i18next';
// const { t } = useTranslation();

const handleNameSubmit = async (e?: React.FormEvent) => {
  if (e) e.preventDefault();
  const nameToSubmit = isEditingName ? displayName : nameInput;
  if (!nameToSubmit.trim()) return;

  setIsLoading(true);
  setError('');
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keyword: nameToSubmit.trim() })
    });
    const data = await handleApiResponse(response);
    if (data.access_token) {
      localStorage.setItem('accessToken', data.access_token);
      localStorage.setItem('name', nameToSubmit);
      setToken(data.access_token);
      setDisplayName(nameToSubmit);
      setIsEditingName(false);

      await Swal.fire({
        icon: 'success',
        title: t('swal.successTitle'),
        text: t('swal.authSuccess'),
        timer: 1500,
        showConfirmButton: false,
      });
    }
  } catch (err: any) {
    setError(err.message);
    await Swal.fire({
      icon: 'error',
      title: t('swal.errorTitle'),
      text: err.message, // err.message มาจาก API จึงไม่ควรแปล
    });
  } finally {
    setIsLoading(false);
  }
};
useEffect(() => {
  const stored = localStorage.getItem('recentUrls');
  if (stored) {
    setRecentUrls(JSON.parse(stored));
  }
}, []);




const handleSubmitUrl = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!originalUrl) {
    setError(t('errors.urlRequired'));
    Swal.fire({
      icon: 'error',
      title: t('swal.errorTitle'),
      text: t('errors.urlRequired'),
    });
    return;
  }
  try {
    new URL(originalUrl);
  } catch {
    setError(t('errors.invalidUrl'));
    Swal.fire({
      icon: 'error',
      title: t('swal.errorTitle'),
      text: t('errors.invalidUrl'),
    });
    return;
  }

  setIsLoading(true);
  setError('');
  setShortenedUrl('');
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/urlshorten/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ original_url: originalUrl })
    });
    const newUrlData = await handleApiResponse(response);
    const fullShortUrl = `${newUrlData.short_key}`;
    const fullUrl = `${newUrlData.original_url}`;
    setShortenedUrl(fullShortUrl);

    const newRecent: ShortenedURL = {
      shortUrl: fullShortUrl,
      originalUrl: originalUrl,
      timestamp: new Date(),
    };
    const updatedRecent = [newRecent, ...recentUrls].slice(0, 5);
    setRecentUrls(updatedRecent);
    localStorage.setItem('recentUrls', JSON.stringify(updatedRecent)); // 🔥 บันทึกลง localStorage
    setOriginalUrl(fullUrl);
    fetchManagedUrls();

    await Swal.fire({
      icon: 'success',
      title: t('swal.shortenedSuccessTitle'),
      text: t('swal.shortenedSuccessText'),
      timer: 1500,
      showConfirmButton: false,
    });
  } catch (err: any) {
    setError(err.message);
    await Swal.fire({
      icon: 'error',
      title: t('swal.errorTitle'),
      text: err.message,
    });
  } finally {
    setIsLoading(false);
  }
};

// const handleUpdateUrl = async (id: string) => {
//   if (!editingValue.trim()) return;

//   setIsLoading(true);
//   setError('');
//   try {
//     await fetch(`${API_BASE_URL}/api/v1/urlshorten/id/${id}`, {
//       method: 'PUT',
//       headers: getAuthHeaders(),
//       body: JSON.stringify({ original_url: editingValue })
//     });
//     setEditingUrlId(null);
//     setEditingValue('');
//     fetchManagedUrls();

//     await Swal.fire({
//       icon: 'success',
//       title: t('swal.updatedSuccessTitle'),
//       text: t('swal.updatedSuccessText'),
//       timer: 1500,
//       showConfirmButton: false,
//     });
//   } catch (err: any) {
//     setError(err.message);
//     await Swal.fire({
//       icon: 'error',
//       title: t('swal.errorTitle'),
//       text: err.message,
//     });
//   } finally {
//     setIsLoading(false);
//   }
// };

const handleDeleteUrl = async (id: string) => {
  const result = await Swal.fire({
    title: t('swal.deleteConfirm.title'),
    text: t('swal.deleteConfirm.text'),
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: t('swal.deleteConfirm.confirmButton'),
    cancelButtonText: t('swal.deleteConfirm.cancelButton'),
  });

  if (!result.isConfirmed) return;

  try {
    await fetch(`${API_BASE_URL}/api/v1/urlshorten/id/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    // Remove from managedUrls immediately
    setManagedUrls(prev => prev.filter(u => u.id !== id));

    await Swal.fire({
      icon: 'success',
      title: t('swal.deletedSuccessTitle'),
      text: t('swal.deletedSuccessText'),
      timer: 1500,
      showConfirmButton: false,
    });
  } catch (err: any) {
    setError(err.message);
    await Swal.fire({
      icon: 'error',
      title: t('swal.errorTitle'),
      text: err.message,
    });
  }
};

const handleLookup = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!lookupKey.trim()) return;

  setError('');
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/urlshorten/${lookupKey.trim()}`, { headers: getAuthHeaders() });
    const data = await handleApiResponse(response);
    setLookupResult(data);
    setIsLookupModalOpen(true);

    await Swal.fire({
      icon: 'success',
      title: t('swal.lookupSuccessTitle'),
      text: t('swal.lookupSuccessText'),
      timer: 1500,
      showConfirmButton: false,
    });
  } catch (err: any) {
    setError(`Lookup failed: ${err.message}`);
    setLookupResult(null);
    setIsLookupModalOpen(false);

    await Swal.fire({
      icon: 'error',
      title: t('swal.lookupFailedTitle'),
      text: err.message,
    });
  }
};

const handleCopy = async (short_key: string, id: string) => {
  try {
    await navigator.clipboard.writeText(short_key); // copy short_key
    setIsCopied(id);
    // PATCH clicks
    try {
      await fetch(`${API_BASE_URL}/api/v1/urlshorten/id/${id}/click`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
      });
      setManagedUrls(prev => {
        const updated = prev.map(u => u.id === id ? { ...u, clicks: (u.clicks ?? 0) + 1 } : u);
        if (urlOrder === 'mostclick') {
          return [...updated].sort((a, b) => (b.clicks ?? 0) - (a.clicks ?? 0));
        }
        return updated;
      });
    } catch {
      // ไม่ต้องแจ้ง error ถ้า update click fail
    }
    Swal.fire({
      position: 'center',  // เปลี่ยนตำแหน่งเป็น center
      icon: 'success',
      title: t('swal.copiedSuccess'),
      showConfirmButton: false,
      timer: 1500
    });
    setTimeout(() => setIsCopied(''), 2000);
  } catch {
    setError(t('errors.copyFailed'));
    Swal.fire({
      icon: 'error',
      title: t('swal.oopsTitle'),
      text: t('errors.copyFailed'),
    });
  }
};


    const clearHistory = () => {
        setRecentUrls([]);
        localStorage.removeItem('recentUrls');
    };
    const fetchManagedUrls = useCallback(async () => {
        if (!token) return;
        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/urlshorten/`, { headers: getAuthHeaders() });
            const data = await handleApiResponse(response);
            setManagedUrls(data);
        } catch (err: any) {
            setError(err.message);
            if (String(err.message).includes('401') || String(err.message).includes('Not authenticated')) {
                localStorage.removeItem('accessToken');
                setToken(null);
            }
        }
    }, [token, getAuthHeaders]);

    const fetchAuditLogs = useCallback(async () => {
        if (!token) return;
        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/urlshorten/audit`, { headers: getAuthHeaders() });
            const data = await handleApiResponse(response);
            setAuditLogs(data);
        } catch (err: any) {
            setError(err.message);
        }
    }, [token, getAuthHeaders]);


    // --- EFFECTS ---
    useEffect(() => {
        if (token) {
            fetchManagedUrls();
            fetchAuditLogs();
        }
    }, [token, fetchManagedUrls, fetchAuditLogs]);

    React.useLayoutEffect(() => {
        if (!token) {
            setShowAuth(true);
            return;
        }
        fetch(`${API_BASE_URL}/api/v1/urlshorten/`, { headers: getAuthHeaders() }).then(res => {
            if (res.status === 401 || res.status === 403) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('name');
                setToken(null);
                setShowAuth(true);
            } else {
                setShowAuth(false);
            }
        }).catch(() => {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('name');
            setToken(null);
            setShowAuth(true);
        });
    }, [token, getAuthHeaders]);

    useEffect(() => {
        try {
            const storedUrls = localStorage.getItem('recentUrls');
            if (storedUrls) {
                const parsed = JSON.parse(storedUrls).map((url: any) => ({ ...url, timestamp: new Date(url.timestamp) }));
                setRecentUrls(parsed);
            }
        } catch (e) {
            console.error("Failed to parse recent URLs from localStorage", e);
        }
    }, []);


    // --- RENDER ---
    if (showAuth) {
        return (
            <div style={styles.authContainer}>
                <div style={styles.authCard}>
                    <div style={styles.iconContainer}><Shield size={32} color="white" /></div>
                    <h1 style={styles.title}>Authentication</h1>
                    <p style={styles.subtitle}>Please enter your name to get an access token.</p>
                    <form onSubmit={handleNameSubmit} style={styles.authForm}>
                        <input type="text" value={nameInput} onChange={(e) => setNameInput(e.target.value)} placeholder="Enter your name..." style={styles.input} autoFocus />
                        <button type="submit" style={styles.button} disabled={isLoading}>
                            {isLoading ? 'Authenticating...' : 'Get Token'}
                        </button>
                    </form>
                    {error && <p style={{ ...styles.errorBox, marginTop: '1rem' }}>{error}</p>}
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start', width: '100%' }}>
                {!isEditingName ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: usernameBg, color: usernameColor, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: '8px 16px', marginTop: 8, marginRight: 8 }}>
                        <span style={{ fontWeight: 500 }}>{displayName || 'No Name'}</span>
                        <button style={{ border: 'none', background: 'none', cursor: 'pointer', color: styles.palette.accent, fontSize: 16, transition: 'background 0.2s', borderRadius: 4 }}
                            onMouseEnter={e => e.currentTarget.style.background = themeMode === 'dark' ? '#333' : '#eee'}
                            onMouseLeave={e => e.currentTarget.style.background = 'none'}
                            onClick={() => setIsEditingName(true)} title="Edit Name">
                            <Edit size={18} color={styles.palette.accent} />
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleNameSubmit} style={{ display: 'flex', alignItems: 'center', gap: 8, background: usernameBg, color: usernameColor, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: '8px 16px', marginTop: 8, marginRight: 8 }}>
                        <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)}
                            style={{ border: `1px solid ${usernameInputBorder}`, borderRadius: 6, padding: '6px 10px', fontSize: 15, minWidth: 80, background: usernameInputBg, color: usernameInputColor }} autoFocus />
                        <button type="submit" style={{ border: 'none', background: styles.palette.accent, color: '#fff', borderRadius: 6, padding: '6px 14px', fontWeight: 500, fontSize: 15, cursor: 'pointer', transition: 'background 0.2s' }}
                            onMouseEnter={e => e.currentTarget.style.background = themeMode === 'dark' ? '#333' : '#eee'}
                            onMouseLeave={e => e.currentTarget.style.background = styles.palette.accent}>
                            {isLoading ? 'Saving...' : 'OK'}
                        </button>
                        <button type="button" style={{ border: 'none', background: 'none', color: '#be123c', fontSize: 16, cursor: 'pointer', borderRadius: 4, transition: 'background 0.2s' }}
                            onMouseEnter={e => e.currentTarget.style.background = themeMode === 'dark' ? '#333' : '#eee'}
                            onMouseLeave={e => e.currentTarget.style.background = 'none'}
                            onClick={() => { setIsEditingName(false); setDisplayName(localStorage.getItem('name') || ''); }} title="Cancel">
                            <XCircle size={18} color="#be123c" />
                        </button>
                    </form>
                )}
            </div>
            <div style={styles.wrapper}>
                <header style={styles.header}>
                    <div style={styles.iconContainer}><Link size={32} color="white" /></div>
                    <h1 style={styles.title}>{t('header.title')}</h1>
                    <p style={styles.subtitle}>{t('header.subtitle')}</p>
                </header>

                <div style={styles.layoutGrid}>
                    <div style={styles.leftColumn}>
                        <main style={styles.mainCard}>
                            <form onSubmit={handleSubmitUrl}>
                                <div style={styles.inputBox}>
                                    <Globe size={20} style={{ marginLeft: '1rem', color: styles.palette.accent }} />
                                    <input type="url" value={originalUrl} onChange={(e) => setOriginalUrl(e.target.value)} placeholder={t('form.placeholder')} style={styles.input} disabled={isLoading} />
                                    <button type="submit" disabled={isLoading} style={{ ...styles.button, opacity: isLoading ? 0.6 : 1 }}>
                                        {isLoading ? (<><div className="spinner" /><span>{t('form.buttonLoading')}</span></>) : (<><Zap size={16} /><span>{t('form.button')}</span></>)}
                                    </button>
                                </div>
                            </form>
                            {error && <div style={{ ...styles.errorBox, marginTop: '1rem' }}><AlertCircle size={20} /> <span>{error}</span></div>}
                           {shortenedUrl && (
    <div style={{ ...styles.successBox, marginTop: '1rem' }}>
    <div style={styles.successHeader}>
      <CheckCircle size={20} color={styles.palette.success} />
      <h3 style={styles.successTitle}>{t('success.title')}</h3>
    </div>
    <div style={styles.urlDisplay}>
      
      <a href={originalUrl} target="_blank" rel="noopener noreferrer" style={styles.urlLink}>
        {shortenedUrl} <ExternalLink size={14} />
      </a>
      <button onClick={() => handleCopy(shortenedUrl, shortenedUrl)} style={styles.copyButton}>
        {isCopied === shortenedUrl ? (
          <>
            <CheckCircle size={14} />
            <span>{t('buttons.copied')}</span>
          </>
        ) : (
          <>
            <Copy size={14} />
            <span>{t('buttons.copy')}</span>
          </>
        )}
      </button>
    </div>
  </div>
)}


                            <div style={styles.featuresGrid}>
                                <div style={{ ...styles.featureCard, cursor: 'default' }}><div style={styles.featureIcon}><Sparkles size={24} color={styles.palette.accent} /></div><h3 style={styles.featureTitle}>{t('features.fast.title')}</h3><p style={styles.featureDesc}>{t('features.fast.desc')}</p></div>
                                <div onClick={() => setSecurityModalOpen(true)} style={styles.featureCard}><div style={styles.featureIcon}><Shield size={24} color={styles.palette.accent} /></div><h3 style={styles.featureTitle}>{t('features.secure.title')}</h3><p style={styles.featureDesc}>{t('features.secure.desc')}</p></div>
                                <div style={{ ...styles.featureCard, cursor: 'default' }}><div style={styles.featureIcon}><TrendingUp size={24} color={styles.palette.accent} /></div><h3 style={styles.featureTitle}>{t('features.stats.title')}</h3><p style={styles.featureDesc}>{t('features.stats.desc')}</p></div>
                            </div>
                        </main>
                        {recentUrls.length > 0 && (
                            <section style={styles.recentCard}>
  <div style={styles.recentHeader}>
    <h2 style={styles.recentTitle}>
      <Clock size={20} color={styles.palette.accent} />
      {t('history.title')}
    </h2>
    <button onClick={clearHistory} style={styles.clearButton}>
      {t('history.clear')}
    </button>
  </div>
  <div>
    {recentUrls.length > 0 && (
      <div
        key={recentUrls[0].shortUrl}
        style={{
          ...styles.urlItem,
          background:
            isHovering === recentUrls[0].shortUrl
              ? styles.palette.urlItemBgHover
              : styles.palette.urlItemBg,
        }}
        onMouseEnter={() => setIsHovering(recentUrls[0].shortUrl)}
        onMouseLeave={() => setIsHovering('')}
      >
        <div style={styles.urlItemContent}>
          <div style={styles.urlItemLeft}>
            <a
              href={recentUrls[0].originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ ...styles.urlItemLink, transition: 'background 0.2s', borderRadius: 4 }}
              onMouseEnter={e => e.currentTarget.style.background = themeMode === 'dark' ? '#333' : '#eee'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
              onClick={async (e) => {
                // PATCH clicks
                e.preventDefault();
                try {
                  await fetch(`${API_BASE_URL}/api/v1/urlshorten/id/${managedUrls.find(u => u.short_key === recentUrls[0].shortUrl)?.id}/click`, {
                    method: 'PATCH',
                    headers: getAuthHeaders(),
                  });
                } catch (err) {}
                window.open(recentUrls[0].originalUrl, '_blank');
              }}
            >
              {recentUrls[0].shortUrl} <ExternalLink size={12} style={{ verticalAlign: 'middle', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = styles.palette.accent} onMouseLeave={e => e.currentTarget.style.color = ''} />
            </a>
            <p style={styles.urlItemOriginal}>{recentUrls[0].originalUrl}</p>
            {managedUrls.length > 0 && managedUrls.find(u => u.short_key === recentUrls[0].shortUrl) && (
              <p style={{ color: styles.palette.accent, fontSize: 13, margin: '2px 0 0 0' }}>
                Clicks: {managedUrls.find(u => u.short_key === recentUrls[0].shortUrl)?.clicks ?? 0}
              </p>
            )}
          </div>
          <button
            onClick={() => handleCopy(recentUrls[0].shortUrl, managedUrls.find(u => u.short_key === recentUrls[0].shortUrl)?.id || recentUrls[0].shortUrl)}
            style={{ ...styles.urlItemButton, transition: 'background 0.2s', borderRadius: 4 }}
            onMouseEnter={e => e.currentTarget.style.background = themeMode === 'dark' ? '#333' : '#eee'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}
          >
            {isCopied === recentUrls[0].shortUrl ? (
              <CheckCircle size={16} style={{ transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = styles.palette.accent} onMouseLeave={e => e.currentTarget.style.color = ''} />
            ) : (
              <Copy size={16} style={{ transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = styles.palette.accent} onMouseLeave={e => e.currentTarget.style.color = ''} />
            )}
          </button>
        </div>
      </div>
    )}
  </div>
</section>

                        )}
                    </div>
                    <div style={styles.rightColumn}>
                        <section style={styles.managementCard}>
                            <form onSubmit={handleLookup} style={styles.lookupForm}>
                                <div style={styles.inputBox}>
                                    <input type="text" value={lookupKey} onChange={e => setLookupKey(e.target.value)} placeholder="Find by short key..." style={styles.input} />
                                    <button type="submit" style={styles.button}><Search size={16} /></button>
                                </div>
                            </form>
                            <div style={styles.tabsContainer}><button onClick={() => setActiveTab('manage')} style={activeTab === 'manage' ? styles.tabButtonActive : styles.tabButton}><Link size={16} /> URL Management</button><button onClick={() => setActiveTab('log')} style={activeTab === 'log' ? styles.tabButtonActive : styles.tabButton}><BookOpen size={16} /> Audit Log</button></div>
                            
                            {/* FIXED: This block was previously commented out by mistake */}
                            <div style={styles.tabContent}>
                                {activeTab === 'manage' && (
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                                            <label htmlFor="urlOrder" style={{ fontWeight: 500 }}>{t('management.orderBy', 'Order by')}:</label>
                                            <select id="urlOrder" value={urlOrder} onChange={e => setUrlOrder(e.target.value as 'timestamp' | 'mostclick')} style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #ccc', fontSize: 15 }}>
                                                <option value="timestamp">{t('management.timestamp', 'Latest')}</option>
                                                <option value="mostclick">{t('management.mostclick', 'Most Clicks')}</option>
                                            </select>
                                        </div>
                                        {getSortedManagedUrls().map(url => (
                                            <div key={url.id} style={styles.listItem}>
                                                {editingUrlId === url.id ? (
                                                    <div style={styles.listItemContent}>
                                                        <div style={{ ...styles.urlItemLeft, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                                            <input type="text" value={editingValue} onChange={(e) => setEditingValue(e.target.value)} style={styles.editInput} />
                                                            <p style={styles.urlItemOriginal}>Short Key: {url.short_key}</p>
                                                        </div>
                                                        <div style={styles.listItemActions}>
                                                          
                                                            <button onClick={handleCancelEdit} style={styles.actionButton}><XCircle size={16} /></button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div style={styles.listItemContent}>
                                                        <div style={styles.urlItemLeft}>
                                                        <a href={url.original_url} target="_blank" rel="noopener noreferrer" style={{ ...styles.urlItemLink, transition: 'background 0.2s', borderRadius: 4 }}
                                                           onMouseEnter={e => e.currentTarget.style.background = themeMode === 'dark' ? '#333' : '#eee'}
                                                           onMouseLeave={e => e.currentTarget.style.background = 'none'}
                                                           onClick={async (e) => {
                                                             e.preventDefault();
                                                             try {
                                                               await fetch(`${API_BASE_URL}/api/v1/urlshorten/id/${url.id}/click`, {
                                                                 method: 'PATCH',
                                                                 headers: getAuthHeaders(),
                                                               });
                                                             } catch (err) {}
                                                             window.open(url.original_url, '_blank');
                                                           }}>
                                                            {`${url.short_key}`} <ExternalLink size={12} style={{ verticalAlign: 'middle', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = styles.palette.accent} onMouseLeave={e => e.currentTarget.style.color = ''} />
                                                        </a>
                                                        <p style={styles.urlItemOriginal}>{url.original_url}</p>
                                                        <p style={{ color: styles.palette.accent, fontSize: 13, margin: '2px 0 0 0' }}>
                                                          Clicks: {url.clicks ?? 0}
                                                        </p>
                                                        </div>
                                                        <div style={styles.listItemActions}>
                                                            <button onClick={() => handleCopy(url.short_key, url.id)} style={{ ...styles.actionButton, transition: 'background 0.2s', borderRadius: 4 }}
                                                                onMouseEnter={e => e.currentTarget.style.background = themeMode === 'dark' ? '#333' : '#eee'}
                                                                onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                                                                {isCopied === url.id ? <CheckCircle size={16} style={{ transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = styles.palette.accent} onMouseLeave={e => e.currentTarget.style.color = ''} /> : <Copy size={16} style={{ transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = styles.palette.accent} onMouseLeave={e => e.currentTarget.style.color = ''} />}
                                                            </button>
                                                          
                                                            <button onClick={() => handleDeleteUrl(url.id)} style={{ ...styles.actionButton, transition: 'background 0.2s', borderRadius: 4 }}
                                                                onMouseEnter={e => e.currentTarget.style.background = themeMode === 'dark' ? '#333' : '#eee'}
                                                                onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                                                                <Trash2 size={16} style={{ transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = styles.palette.accent} onMouseLeave={e => e.currentTarget.style.color = ''} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {activeTab === 'log' && (
                                    <div>
                                        {auditLogs.map(log => (
                                            <div key={log.id} style={styles.listItem}>
                                                <div style={styles.listItemContent}>
                                                    <div style={styles.urlItemLeft}>
                                                        <p style={styles.logAction}>{log.action} {log.short_key} </p>
                                                        <p style={styles.logMeta}>By: <strong>{log.performed_by}</strong> at {new Date(log.performed_at).toLocaleString()}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
            {isLookupModalOpen && lookupResult && (
                <Rnd style={styles.modal} default={{ x: window.innerWidth / 2 - 225, y: 150, width: 450, height: 300 }} minWidth={300} minHeight={200} bounds="parent" dragHandleClassName="modal-drag-handle">
                    <div style={styles.modalHeader} className="modal-drag-handle">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Search size={16} /><span>Lookup Result</span></div>
                        <button onClick={() => setIsLookupModalOpen(false)} style={styles.modalCloseButton}><XCircle size={20} /></button>
                    </div>
                    <div style={styles.modalContent}>
                        <p><strong>Original URL:</strong> <a href={originalUrl} target="_blank" rel="noopener noreferrer">{lookupResult.original_url}</a></p>
                        <p><strong>Short Key:</strong> {lookupResult.short_key}</p>
                        <p><strong>Clicks:</strong> {lookupResult.clicks}</p>
                        <p><strong>Created By:</strong> {lookupResult.created_by}</p>
                    </div>
                </Rnd>
            )}
            {isSecurityModalOpen && (
                <Rnd style={styles.modal} default={{ x: window.innerWidth / 2 - 275, y: 120, width: 550, height: 420, }} minWidth={320} minHeight={250} bounds="parent" dragHandleClassName="modal-drag-handle">
                    <div style={styles.modalHeader} className="modal-drag-handle">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Shield size={16} /><span>Security Information</span></div>
                        <button onClick={() => setSecurityModalOpen(false)} style={styles.modalCloseButton}><XCircle size={20} /></button>
                    </div>
                    <div style={styles.modalContent}>
                        <h3>Our Commitment to Security</h3><p>We prioritize the security of your links and data. All submissions are automatically scanned for malicious content using industry-leading threat intelligence databases.</p><h4>Data Encryption</h4><p>All data, both in transit and at rest, is encrypted using strong cryptographic protocols like TLS 1.3 and AES-256.</p><h4>Regular Audits</h4><p>Our systems undergo regular security audits and penetration testing to identify and remediate potential vulnerabilities.</p><p>This is a placeholder document. You can add more detailed information, policies, and contact information here.</p>
                    </div>
                </Rnd>
            )}
            <style dangerouslySetInnerHTML={{ __html: `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } } .spinner { width: 16px; height: 16px; border: 2px solid #fff; border-top: 2px solid transparent; border-radius: 50%; animation: spin 1s linear infinite; } input::placeholder { color: ${styles.palette.inputPlaceholder}; } @media (max-width: 900px) { .layout-grid { grid-template-columns: 1fr; } }`}} />
        </div>
    );
}

export default URLshortenPage;