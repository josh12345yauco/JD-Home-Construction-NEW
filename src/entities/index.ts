/**
 * Auto-generated entity types
 * Contains all CMS collection interfaces in a single file 
 */

/**
 * Collection ID: faqs
 * Interface for FAQs
 */
export interface FAQs {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  question?: string;
  /** @wixFieldType text */
  answer?: string;
  /** @wixFieldType text */
  category?: string;
  /** @wixFieldType boolean */
  isFeatured?: boolean;
  /** @wixFieldType number */
  displayOrder?: number;
}


/**
 * Collection ID: projects
 * Interface for Projects
 */
export interface Projects {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  projectTitle?: string;
  /** @wixFieldType text */
  category?: string;
  /** @wixFieldType text */
  location?: string;
  /** @wixFieldType text */
  scopeOfWork?: string;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  beforeImage?: string;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  afterImage?: string;
  /** @wixFieldType text */
  projectDescription?: string;
  /** @wixFieldType media_gallery */
  mediagallery?: any;
}


/**
 * Collection ID: services
 * Interface for Services
 */
export interface Services {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  serviceName?: string;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  serviceImage?: string;
  /** @wixFieldType text */
  shortDescription?: string;
  /** @wixFieldType text */
  detailedDescription?: string;
  /** @wixFieldType text */
  processSteps?: string;
  /** @wixFieldType text */
  benefits?: string;
  /** @wixFieldType text */
  timelineEstimate?: string;
}
