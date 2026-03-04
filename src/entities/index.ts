export interface FAQs {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  question?: string;
  answer?: string;
  category?: string;
  isFeatured?: boolean;
  displayOrder?: number;
  [key: string]: unknown;
}

export interface Projects {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  projectTitle?: string;
  category?: string;
  location?: string;
  scopeOfWork?: string;
  beforeImage?: string;
  afterImage?: string;
  projectDescription?: string;
  mediagallery?: any;
  [key: string]: unknown;
}

export interface Services {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  serviceName?: string;
  serviceImage?: string;
  shortDescription?: string;
  detailedDescription?: string;
  processSteps?: string;
  benefits?: string;
  timelineEstimate?: string;
  [key: string]: unknown;
}
