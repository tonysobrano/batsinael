import fs from 'fs';
import path from 'path';

export interface ProjectData {
  name: string;
  cover: string;
  path: string;
}

// Get all files in a specific directory
export function getImagesFromDirectory(dir: string): string[] {
  const imagesPath = path.join(process.cwd(), 'public', dir);
  try {
    const files = fs.readdirSync(imagesPath);
    return files
      .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
      .map(file => encodeURI(`/${dir}/${file}`));
  } catch (error) {
    console.error(`Error reading directory ${imagesPath}:`, error);
    return [];
  }
}

// Get subdirectories (projects) within a main category (e.g., 'img/projects')
export function getProjectsWithCovers(categoryDir: string): ProjectData[] {
  const rootPath = path.join(process.cwd(), 'public', categoryDir);
  try {
    const items = fs.readdirSync(rootPath, { withFileTypes: true });
    const projects: ProjectData[] = [];

    for (const item of items) {
      if (item.isDirectory()) {
        const projectPath = path.join(rootPath, item.name);
        const files = fs.readdirSync(projectPath);
        
        // Find the first image to use as a cover
        const coverFile = files.find(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file));
        
        if (coverFile) {
          projects.push({
            name: item.name,
            cover: encodeURI(`/${categoryDir}/${item.name}/${coverFile}`),
            path: encodeURI(`/${categoryDir.replace('img/', '')}/${item.name}`) // e.g. /projects/Ashara
          });
        }
      }
    }
    return projects;
  } catch (error) {
    console.error(`Error reading directory ${rootPath}:`, error);
    return [];
  }
}

// Grab one cover image from EVERY project across all categories for the Home page
export function getHomeGridImages(): ProjectData[] {
  const categories = ['img/projects', 'img/brands', 'img/portraits'];
  let allProjects: ProjectData[] = [];

  for (const category of categories) {
    allProjects = [...allProjects, ...getProjectsWithCovers(category)];
  }

  // Shuffle array using Fisher-Yates algorithm for an asymmetrical look
  for (let i = allProjects.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allProjects[i], allProjects[j]] = [allProjects[j], allProjects[i]];
  }

  return allProjects;
}
