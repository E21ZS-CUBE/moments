import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, AlertCircle, RefreshCw } from 'lucide-react';
import type { GalleryImage } from '@/services/api';
import { galleryAPI } from '@/services/api';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { GallerySkeleton } from '@/components/skeletons';

export function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch gallery images from API
  const fetchImages = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await galleryAPI.getAll();
      setImages(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch gallery images');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsUploading(true);
      await galleryAPI.upload(files);
      await fetchImages();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to upload images');
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      await galleryAPI.delete(id);
      await fetchImages();
      if (selectedImage?._id === id) {
        setSelectedImage(null);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete image');
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
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
          <h3 className="text-xl text-white mb-2">Failed to load gallery</h3>
          <p className="text-white/50 mb-4">{error}</p>
          <button
            onClick={fetchImages}
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
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="font-serif text-4xl md:text-5xl text-white mb-4">
            Our Gallery
          </h1>
          <p className="text-white/50 text-lg">
            memories captured in time
          </p>
        </motion.div>

        {isLoading ? (
          <GallerySkeleton />
        ) : images.length === 0 ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div
              onClick={() => !isUploading && fileInputRef.current?.click()}
              className={`
                w-full max-w-md aspect-[4/3] glass rounded-3xl 
                flex flex-col items-center justify-center gap-6 
                cursor-pointer hover:bg-white/10 transition-all group
                ${isUploading ? 'opacity-50 pointer-events-none' : ''}
              `}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors"
              >
                {isUploading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <RefreshCw className="w-12 h-12 text-white/40" />
                  </motion.div>
                ) : (
                  <Plus className="w-12 h-12 text-white/40 group-hover:text-white/60 transition-colors" />
                )}
              </motion.div>
              <div className="text-center">
                <p className="text-white/60 text-lg font-medium mb-2">
                  {isUploading ? 'Uploading...' : 'Add your first photo'}
                </p>
                <p className="text-white/30 text-sm">
                  Click to upload images
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Add Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex justify-center mb-8"
            >
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="
                  flex items-center gap-2 px-6 py-3 
                  glass rounded-full 
                  text-white/60 hover:text-white hover:bg-white/10 
                  transition-all disabled:opacity-50 disabled:cursor-not-allowed
                "
              >
                {isUploading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <RefreshCw className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <Plus className="w-5 h-5" />
                )}
                <span>{isUploading ? 'Uploading...' : 'Add Photos'}</span>
              </button>
            </motion.div>

            {/* Image Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              <AnimatePresence mode="popLayout">
                {images.map((image, index) => (
                  <motion.div
                    key={image._id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="group relative aspect-square rounded-2xl overflow-hidden glass cursor-pointer"
                    onClick={() => setSelectedImage(image)}
                  >
                    <img
                      src={image.imageUrl}
                      alt="Gallery image"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <p className="text-white/80 text-xs">
                          {formatDate(image.createdAt)}
                        </p>
                      </div>
                      
                      {/* Delete button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(image._id);
                        }}
                        className="absolute top-3 right-3 p-2 rounded-full bg-black/50 text-white/60 hover:text-red-400 hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>

      {/* Image Preview Modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="bg-slate-900 border-white/10 text-white max-w-4xl p-0 overflow-hidden">
          {selectedImage && (
            <div className="relative">
              <img
                src={selectedImage.imageUrl}
                alt="Preview"
                className="w-full max-h-[70vh] object-contain bg-black/50"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-white/60 text-sm">
                  Added on {formatDate(selectedImage.createdAt)}
                </p>
              </div>
              <button
                onClick={() => handleDelete(selectedImage._id)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white/60 hover:text-red-400 hover:bg-black/70 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
