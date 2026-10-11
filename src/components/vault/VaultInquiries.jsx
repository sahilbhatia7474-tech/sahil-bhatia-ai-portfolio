import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot 
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { updateInquiryStatus, deleteInquiry } from '../../lib/dbService';
import { useAuth } from '../../lib/authContext';
import { 
  Mail, 
  Clock, 
  Trash2, 
  Reply, 
  Check, 
  Filter, 
  Lock, 
  AlertCircle,
  Tag,
  DollarSign,
  Calendar,
  User,
  Inbox,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';

export default function VaultInquiries() {
  const { canEdit } = useAuth();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [actionSuccess, setActionSuccess] = useState(null);

  // Real-time Firestore subscription to messages collection STRICTLY for authenticated founder
  useEffect(() => {
    if (!canEdit) {
      setLoading(false);
      return;
    }

    let unsubscribe = () => {};
    try {
      const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const docs = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
          }));
          setInquiries(docs);
          setLoading(false);
          setError(null);
        },
        (err) => {
          if (err?.code === 'permission-denied') {
            setError('Access to client inquiries requires verified Founder credentials.');
          } else {
            console.warn('Inquiries listener notice:', err?.message || err);
            setError('Failed to stream inquiries. Please verify Founder permissions.');
          }
          setLoading(false);
        }
      );
    } catch (err) {
      console.warn('Inquiries listener setup exception:', err?.message || err);
      setLoading(false);
    }
    return () => unsubscribe();
  }, [canEdit]);

  const handleStatusChange = async (id, newStatus) => {
    const res = await updateInquiryStatus(id, newStatus);
    if (res.success) {
      setActionSuccess(`Inquiry marked as ${newStatus}`);
      setTimeout(() => setActionSuccess(null), 3000);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this client inquiry? This action is permanent.')) {
      return;
    }
    const res = await deleteInquiry(id);
    if (res.success) {
      setActionSuccess('Inquiry deleted successfully');
      setTimeout(() => setActionSuccess(null), 3000);
    }
  };

  const unreadCount = inquiries.filter((inq) => inq.status === 'UNREAD').length;

  const filteredInquiries = inquiries.filter((inq) => {
    if (statusFilter === 'ALL') return true;
    return inq.status === statusFilter;
  });

  if (!canEdit) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-semibold">
                SECURITY VAULT // RESTRICTED PROTOCOL
              </span>
            </div>
            <h2 className="text-xl font-bold font-display text-white uppercase tracking-wider flex items-center gap-2">
              <Lock className="w-5 h-5 text-cyan-400" />
              <span>CLIENT INQUIRIES &amp; CONSULTATION BRIEFS</span>
            </h2>
            <p className="text-xs text-neutral-400 mt-1 font-sans">
              Encrypted channel for client briefs, communication requests, and direct inquiries.
            </p>
          </div>
          <div className="px-3.5 py-1.5 rounded-lg bg-black/60 border border-white/10 font-mono text-xs text-cyan-300 flex items-center gap-2">
            <Lock className="w-3.5 h-3.5" />
            <span>FOUNDER ONLY</span>
          </div>
        </div>

        <div className="max-w-2xl mx-auto my-8 p-8 rounded-2xl bg-[#090d16] border border-cyan-500/30 text-center space-y-5 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
              PRIVACY COMPLIANCE // FOUNDER RESTRICTED
            </span>
            <h3 className="text-2xl font-bold font-display text-white uppercase tracking-wider">
              CLIENT COMMUNICATIONS ARE PRIVATE
            </h3>
            <p className="text-sm text-neutral-300 leading-relaxed font-sans max-w-lg mx-auto">
              Client briefs and messages contain confidential contact information (email addresses, project budgets, and messages). To protect client privacy, this telemetry is strictly accessible to verified founder <strong className="text-white">Sahil Bhatia (sahilbhatia7474@gmail.com)</strong>.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-black/50 border border-white/5 text-xs font-mono text-neutral-400 flex items-center justify-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Enforced by Firebase Security Rules: Non-founder read operations are completely blocked at the database engine level.</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold font-display text-white uppercase tracking-wider flex items-center gap-2">
              <Mail className="w-5 h-5 text-red-500" />
              <span>CLIENT INQUIRIES &amp; CONSULTATION BRIEFS</span>
            </h2>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-red-600 text-white font-mono text-xs font-bold shadow-[0_0_10px_#ff2a3a]">
                {unreadCount} NEW
              </span>
            )}
          </div>
          <p className="text-xs text-neutral-400 mt-1 font-sans">
            Secure client inquiries received directly through the portfolio contact form in Firestore.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-neutral-400">
          <div className="p-2 rounded-lg bg-[#0e1017] border border-white/10 flex items-center gap-2">
            <Inbox className="w-4 h-4 text-red-400" />
            <span>Total Inquiries: <strong className="text-white">{inquiries.length}</strong></span>
          </div>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-mono text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {error && (
        <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 font-mono text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="rounded-xl bg-[#0b0c12] border border-white/10 p-3 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-neutral-400" />
          <span className="text-neutral-400">Filter By Status:</span>
          {['ALL', 'UNREAD', 'READ', 'CONTACTED', 'ARCHIVED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-lg border transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-red-600 text-white border-red-500 font-bold shadow-[0_0_12px_rgba(255,42,58,0.3)]'
                  : 'bg-[#141620] text-neutral-400 border-white/10 hover:text-white'
              }`}
            >
              {st}
              {st === 'UNREAD' && unreadCount > 0 && ` (${unreadCount})`}
            </button>
          ))}
        </div>
      </div>

      {/* Inquiries Stream */}
      {loading ? (
        <div className="py-20 text-center font-mono text-xs text-neutral-400 space-y-2">
          <Clock className="w-6 h-6 text-red-500 animate-spin mx-auto" />
          <p>Syncing secure Firestore inquiries stream...</p>
        </div>
      ) : filteredInquiries.length === 0 ? (
        <div className="py-20 text-center rounded-2xl bg-[#0a0b10] border border-white/10 space-y-3 font-mono text-xs">
          <Inbox className="w-10 h-10 text-neutral-600 mx-auto" />
          <h3 className="text-sm font-bold text-neutral-300 uppercase">
            {statusFilter === 'ALL' ? 'No Consultation Inquiries Received Yet' : `No ${statusFilter} Inquiries Found`}
          </h3>
          <p className="text-neutral-500 max-w-md mx-auto font-sans">
            Inquiries dispatched by potential clients from the portfolio contact form will populate here in real-time.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredInquiries.map((inq) => {
            const isUnread = inq.status === 'UNREAD';
            const formattedDate = inq.createdAt 
              ? new Date(inq.createdAt).toLocaleString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Recent';

            return (
              <div
                key={inq.id}
                className={`p-6 rounded-2xl border transition-all space-y-4 ${
                  isUnread
                    ? 'bg-[#10121d] border-red-500/50 shadow-[0_4px_24px_rgba(255,42,58,0.1)] ring-1 ring-red-500/25'
                    : 'bg-[#0a0b12] border-white/10 hover:border-white/20'
                }`}
              >
                {/* Inquiry Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-white/5">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-white flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-red-400" />
                        <span>{inq.name}</span>
                      </span>
                      {isUnread && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-950/80 text-red-300 border border-red-500/40 animate-pulse">
                          UNREAD
                        </span>
                      )}
                      {inq.confidentialityRequested && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5" />
                          <span>NDA ENFORCED</span>
                        </span>
                      )}
                    </div>

                    <a 
                      href={`mailto:${inq.email}?subject=${encodeURIComponent(`Re: ${inq.subject || 'Consultation Inquiry'} — Sahil Bhatia`)}`}
                      className="text-xs font-mono text-neutral-400 hover:text-white flex items-center gap-1.5 transition-colors"
                    >
                      <Mail className="w-3 h-3 text-neutral-500" />
                      <span>{inq.email}</span>
                    </a>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="text-neutral-500 text-[11px] flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formattedDate}</span>
                    </span>

                    {/* Status Action Dropdown */}
                    <select
                      value={inq.status || 'UNREAD'}
                      onChange={(e) => handleStatusChange(inq.id, e.target.value)}
                      className="px-2.5 py-1 rounded-lg bg-[#141622] border border-white/15 text-white text-[11px] font-mono focus:outline-none focus:border-red-500/50"
                    >
                      <option value="UNREAD">Mark as UNREAD</option>
                      <option value="READ">Mark as READ</option>
                      <option value="CONTACTED">Mark as CONTACTED</option>
                      <option value="ARCHIVED">Mark as ARCHIVED</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => handleDelete(inq.id)}
                      title="Delete inquiry"
                      className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Inquiry Telemetry Tags */}
                <div className="flex flex-wrap gap-2 text-[11px] font-mono">
                  <span className="px-2.5 py-1 rounded-md bg-[#131522] border border-white/5 text-neutral-300 flex items-center gap-1.5">
                    <Tag className="w-3 h-3 text-red-400" />
                    <span>Track: <strong className="text-white">{inq.category || 'AI Systems'}</strong></span>
                  </span>

                  <span className="px-2.5 py-1 rounded-md bg-[#131522] border border-white/5 text-neutral-300 flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>Timeline: <strong className="text-white">{inq.timeline || 'STANDARD'}</strong></span>
                  </span>

                  <span className="px-2.5 py-1 rounded-md bg-[#131522] border border-white/5 text-neutral-300 flex items-center gap-1.5">
                    <DollarSign className="w-3 h-3 text-emerald-400" />
                    <span>Scope/Budget: <strong className="text-white">{inq.budget || 'Unspecified'}</strong></span>
                  </span>
                </div>

                {/* Problem Statement / Message Body */}
                <div className="p-4 rounded-xl bg-[#06070c] border border-white/5 font-sans text-xs sm:text-sm text-neutral-200 leading-relaxed whitespace-pre-wrap selection:bg-red-600 selection:text-white">
                  {inq.message || inq.problem}
                </div>

                {/* Actions Footer */}
                <div className="pt-2 flex items-center justify-between font-mono text-xs">
                  <span className="text-[10px] text-neutral-500">
                    ID: {inq.id}
                  </span>

                  <a
                    href={`mailto:${inq.email}?subject=${encodeURIComponent(`Re: ${inq.subject || 'Consultation Inquiry'} — Sahil Bhatia`)}&body=${encodeURIComponent(`Hi ${inq.name},\n\nThank you for reaching out regarding ${inq.category || 'your project'}.\n\n`)}`}
                    className="px-3.5 py-1.5 rounded-lg bg-white text-black font-bold hover:bg-neutral-200 transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <Reply className="w-3.5 h-3.5" />
                    <span>Reply via Email</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
