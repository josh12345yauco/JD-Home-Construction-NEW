import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Image } from '@/components/ui/image';
import { Heart, MessageCircle, Share2 } from 'lucide-react';

interface InstagramPost {
  id: string;
  caption: string;
  media_type: string;
  media_url: string;
  permalink: string;
  timestamp: string;
  like_count?: number;
  comments_count?: number;
}

export default function InstagramFeed() {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInstagramFeed = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Using Instagram Graph API
        // Note: You'll need to set up an Instagram Business Account and get an access token
        // For now, we'll use a public endpoint that doesn't require authentication
        const username = 'jdhomeconstruction';
        
        // Fetch using Instagram's public data (limited approach)
        // For production, use Instagram Graph API with proper authentication
        const response = await fetch(
          `https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`,
          {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch Instagram feed');
        }

        const data = await response.json();
        
        // Extract posts from the response
        if (data.data?.user?.edge_owner_to_timeline_media?.edges) {
          const instagramPosts = data.data.user.edge_owner_to_timeline_media.edges
            .slice(0, 9)
            .map((edge: any) => ({
              id: edge.node.id,
              caption: edge.node.edge_media_to_caption?.edges?.[0]?.node?.text || '',
              media_type: edge.node.__typename,
              media_url: edge.node.display_url,
              permalink: `https://instagram.com/p/${edge.node.shortcode}`,
              timestamp: new Date(edge.node.taken_at_timestamp * 1000).toISOString(),
              like_count: edge.node.edge_liked_by?.count || 0,
              comments_count: edge.node.edge_media_to_comment?.count || 0,
            }));

          setPosts(instagramPosts);
        }
      } catch (err) {
        console.error('Error fetching Instagram feed:', err);
        setError('Unable to load Instagram feed. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInstagramFeed();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center py-20">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full text-center py-20">
        <p className="font-paragraph text-lg text-foreground/60 mb-4">{error}</p>
        <a
          href="https://www.instagram.com/jdhomeconstruction/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-3 bg-primary text-primary-foreground font-heading font-bold rounded-lg hover:opacity-90 transition-opacity"
        >
          Visit Instagram Profile
        </a>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="w-full text-center py-20">
        <p className="font-paragraph text-lg text-foreground/60 mb-4">No posts available</p>
        <a
          href="https://www.instagram.com/jdhomeconstruction/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-3 bg-primary text-primary-foreground font-heading font-bold rounded-lg hover:opacity-90 transition-opacity"
        >
          Visit Instagram Profile
        </a>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-8 py-0">
        {posts.map((post, index) => (
          <motion.a
            key={post.id}
            href={post.permalink}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true, margin: '0px 100px' }}
            className="block"
          >
            {/* Card */}
            <motion.div
              className="relative w-full h-[300px] rounded-[14px] overflow-hidden shadow-lg group flex flex-col cursor-pointer"
              whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
              transition={{ duration: 0.3 }}
            >
              {/* Image */}
              <div className="relative w-full h-full overflow-hidden">
                <Image
                  src={post.media_url}
                  alt={post.caption || 'Instagram post'}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Content - Hover State */}
              <motion.div
                className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              >
                <div className="flex items-center gap-8 text-white">
                  <div className="flex items-center gap-2">
                    <Heart size={24} fill="white" />
                    <span className="font-heading font-bold">{post.like_count}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageCircle size={24} />
                    <span className="font-heading font-bold">{post.comments_count}</span>
                  </div>
                </div>
              </motion.div>

              {/* Caption - Top */}
              <motion.div
                className="absolute top-0 left-0 right-0 p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              >
                {post.caption && (
                  <p className="font-paragraph text-sm text-white line-clamp-3">
                    {post.caption}
                  </p>
                )}
              </motion.div>

              {/* Soft Shadow for Depth */}
              <div className="absolute inset-0 rounded-[14px] shadow-[inset_0_0_30px_rgba(0,0,0,0.2)] pointer-events-none" />
            </motion.div>
          </motion.a>
        ))}
      </div>

      {/* View Profile Link */}
      <div className="text-center mt-12">
        <a
          href="https://www.instagram.com/jdhomeconstruction/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground font-heading font-bold rounded-lg hover:opacity-90 transition-opacity"
        >
          <span>Follow on Instagram</span>
          <Share2 size={18} />
        </a>
      </div>
    </div>
  );
}
