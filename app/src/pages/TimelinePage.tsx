import { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Calendar, Image as ImageIcon, Filter, AlertCircle, RefreshCw } from 'lucide-react';
import type { Moment } from '@/services/api';
import { momentsAPI } from '@/services/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { TimelineSkeleton } from '@/components/skeletons';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface MomentFormData {
  title: string;
  short: string;
  full: string;
  date: string;
  image: File | null;
  imagePreview: string;
}

export function TimelinePage() {
  const [moments, setMoments] = useState<Moment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMoment, setEditingMoment] = useState<Moment | null>(null);
  const [filterYear, setFilterYear] = useState<string>('all');
  const [filterMonth, setFilterMonth] = useState<string>('all');

  const [formData, setFormData] = useState<MomentFormData>({
    title: '',
    short: '',
    full: '',
    date: '',
    image: null,
    imagePreview: ''
  });

  // Fetch moments from API
  const fetchMoments = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await momentsAPI.getAll();
      setMoments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch moments');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMoments();
  }, [fetchMoments]);

  // Get unique years and months from moments
  const { years, months } = useMemo(() => {
    const uniqueYears = new Set<string>();
    const uniqueMonths = new Set<string>();
    
    moments.forEach(moment => {
      const date = new Date(moment.date);
      uniqueYears.add(date.getFullYear().toString());
      uniqueMonths.add((date.getMonth() + 1).toString().padStart(2, '0'));
    });
    
    return {
      years: Array.from(uniqueYears).sort(),
      months: Array.from(uniqueMonths).sort()
    };
  }, [moments]);

  // Filter moments
  const filteredMoments = useMemo(() => {
    return moments.filter(moment => {
      const date = new Date(moment.date);
      const year = date.getFullYear().toString();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      
      const yearMatch = filterYear === 'all' || year === filterYear;
      const monthMatch = filterMonth === 'all' || month === filterMonth;
      
      return yearMatch && monthMatch;
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [moments, filterYear, filterMonth]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ 
          ...prev, 
          image: file,
          imagePreview: reader.result as string 
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const submitData = {
        title: formData.title,
        short: formData.short,
        full: formData.full,
        date: formData.date,
        image: formData.image
      };

      if (editingMoment) {
        await momentsAPI.update(editingMoment._id, submitData);
        setEditingMoment(null);
      } else {
        await momentsAPI.create(submitData);
      }
      
      // Refresh moments list
      await fetchMoments();
      
      setIsAddModalOpen(false);
      resetForm();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save moment');
    }
  };

  const handleEdit = (moment: Moment) => {
    setEditingMoment(moment);
    setFormData({
      title: moment.title,
      short: moment.short,
      full: moment.full,
      date: moment.date.split('T')[0],
      image: null,
      imagePreview: moment.imageUrl || ''
    });
    setIsAddModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this moment?')) return;
    
    try {
      await momentsAPI.delete(id);
      await fetchMoments();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete moment');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      short: '',
      full: '',
      date: '',
      image: null,
      imagePreview: ''
    });
    setEditingMoment(null);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Error state
  if (error && !isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen px-4 py-8 md:py-12 flex items-center justify-center"
      >
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl text-white mb-2">Failed to load moments</h3>
          <p className="text-white/50 mb-4">{error}</p>
          <button
            onClick={fetchMoments}
            className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-colors mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen px-4 py-8 md:py-12"
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="font-serif text-4xl md:text-5xl text-white mb-4">
            Our Timeline
          </h1>
          <p className="text-white/50 text-lg">
            moments that matter
          </p>
        </motion.div>

        {/* Filters */}
        {!isLoading && moments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-wrap items-center justify-center gap-3 mb-12"
          >
            <div className="flex items-center gap-2 text-white/40">
              <Filter className="w-4 h-4" />
              <span className="text-sm">Filter:</span>
            </div>
            
            <Select value={filterYear} onValueChange={setFilterYear}>
              <SelectTrigger className="w-28 bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/10">
                <SelectItem value="all">All Years</SelectItem>
                {years.map(year => (
                  <SelectItem key={year} value={year}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterMonth} onValueChange={setFilterMonth}>
              <SelectTrigger className="w-32 bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/10">
                <SelectItem value="all">All Months</SelectItem>
                {months.map(month => (
                  <SelectItem key={month} value={month}>
                    {new Date(2000, parseInt(month) - 1).toLocaleDateString('en-US', { month: 'long' })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {(filterYear !== 'all' || filterMonth !== 'all') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setFilterYear('all'); setFilterMonth('all'); }}
                className="text-white/40 hover:text-white"
              >
                Clear
              </Button>
            )}
          </motion.div>
        )}

        {/* Timeline */}
        {isLoading ? (
          <TimelineSkeleton />
        ) : (
          <div className="relative">
            {/* Center line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px timeline-line md:-translate-x-1/2" />

            {/* Moments */}
            <div className="space-y-8 md:space-y-12">
              <AnimatePresence mode="popLayout">
                {filteredMoments.map((moment, index) => (
                  <motion.div
                    key={moment._id}
                    layout
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`relative flex items-start gap-6 md:gap-0 ${
                      index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                    }`}
                  >
                    {/* Timeline dot */}
                    <div className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full bg-purple-400 border-2 border-slate-900 md:-translate-x-1/2 z-10 shadow-lg shadow-purple-400/30" />

                    {/* Content card */}
                    <div className={`ml-10 md:ml-0 md:w-[45%] ${
                      index % 2 === 0 ? 'md:mr-auto md:pr-12' : 'md:ml-auto md:pl-12'
                    }`}>
                      <div className="glass rounded-2xl overflow-hidden card-hover group">
                        {/* Image */}
                        {moment.imageUrl ? (
                          <div className="aspect-video overflow-hidden">
                            <img
                              src={moment.imageUrl}
                              alt={moment.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              loading="lazy"
                            />
                          </div>
                        ) : (
                          <div className="aspect-video bg-white/5 flex items-center justify-center">
                            <ImageIcon className="w-12 h-12 text-white/20" />
                          </div>
                        )}

                        {/* Content */}
                        <div className="p-5">
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div>
                              <h3 className="font-serif text-xl text-white mb-1">
                                {moment.title}
                              </h3>
                              <p className="text-purple-300 text-sm">
                                {moment.short}
                              </p>
                            </div>
                            
                            {/* Actions */}
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleEdit(moment)}
                                className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(moment._id)}
                                className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-white/10 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <p className="text-white/50 text-sm leading-relaxed mb-4">
                            {moment.full}
                          </p>

                          <div className="flex items-center gap-2 text-white/30 text-xs">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(moment.date)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Add Moment Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: filteredMoments.length * 0.1 }}
                className={`relative flex items-start gap-6 md:gap-0 ${
                  filteredMoments.length % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Timeline dot */}
                <div className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full bg-pink-400 border-2 border-slate-900 md:-translate-x-1/2 z-10 shadow-lg shadow-pink-400/30" />

                {/* Add card */}
                <div className={`ml-10 md:ml-0 md:w-[45%] ${
                  filteredMoments.length % 2 === 0 ? 'md:mr-auto md:pr-12' : 'md:ml-auto md:pl-12'
                }`}>
                  <button
                    onClick={() => { resetForm(); setIsAddModalOpen(true); }}
                    className="w-full glass rounded-2xl p-8 flex flex-col items-center justify-center gap-4 text-white/40 hover:text-white/60 hover:bg-white/10 transition-all group"
                  >
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                      <Plus className="w-8 h-8" />
                    </div>
                    <span className="font-medium">Add a new moment</span>
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && filteredMoments.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-white/40 text-lg">
              {moments.length === 0 
                ? 'No moments yet. Create your first moment!' 
                : 'No moments found for the selected filters.'}
            </p>
          </motion.div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="bg-slate-900 border-white/10 text-white max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">
              {editingMoment ? 'Edit Moment' : 'Add New Moment'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5 mt-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Random Start"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="short">Short Description</Label>
              <Input
                id="short"
                value={formData.short}
                onChange={e => setFormData(prev => ({ ...prev, short: e.target.value }))}
                placeholder="e.g., a simple hi that stayed"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="full">Full Story</Label>
              <Textarea
                id="full"
                value={formData.full}
                onChange={e => setFormData(prev => ({ ...prev, full: e.target.value }))}
                placeholder="Tell the full story..."
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 min-h-[100px]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="bg-white/5 border-white/10 text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Image</Label>
              <div className="flex items-center gap-3">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="bg-white/5 border-white/10 text-white file:text-white/60"
                />
              </div>
              {formData.imagePreview && (
                <div className="mt-3 aspect-video rounded-lg overflow-hidden">
                  <img 
                    src={formData.imagePreview} 
                    alt="Preview" 
                    className="w-full h-full object-cover" 
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddModalOpen(false)}
                className="flex-1 border-white/10 text-white hover:bg-white/10"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-purple-500 hover:bg-purple-600 text-white"
              >
                {editingMoment ? 'Save Changes' : 'Add Moment'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
