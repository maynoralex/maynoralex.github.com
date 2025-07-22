document.addEventListener('DOMContentLoaded', () => {
    // Set current year in the footer
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // --- Data for Skills and Projects ---
    // Using Font Awesome classes for skill icons
    const skillsData = [
        { name: 'React', iconClass: 'fab fa-react' },
        { name: 'JavaScript', iconClass: 'fab fa-js-square' },
        { name: 'Python', iconClass: 'fab fa-python' },
        { name: 'Node.js', iconClass: 'fab fa-node-js' },
        { name: 'C#', iconClass: 'fas fa-hashtag' }, // Added C#
        { name: 'AWS', iconClass: 'fab fa-aws' }, // Added AWS
        { name: 'Azure', iconClass: 'fab fa-microsoft' }, // Added Azure (using general Microsoft icon)
        { name: 'TypeScript', iconClass: 'fab fa-node' }, // Added TypeScript (using Node.js icon as a common alternative)
        { name: 'Angular', iconClass: 'fab fa-angular' }, // Added Angular
        { name: 'Databases (SQL/NoSQL)', iconClass: 'fas fa-database' },
        { name: 'Cloud Platforms (AWS/GCP)', iconClass: 'fas fa-cloud' },
        { name: 'Git & CI/CD', iconClass: 'fab fa-git-alt' },
        { name: 'RESTful APIs', iconClass: 'fas fa-exchange-alt' },
    ];

    let projectsData = [
        {
            id: 1,
            title: 'RESTful Web API using Clean Architecture',
            description: 'A .NET Core Web API built using best practices, architecture patterns: Entity Framework, AutoMapper, MediatR (CQRS), Authentication/Authorization using Microsoft Identity also Custom Authorization by extending Identity Custom Validators. Implemented Unit Tests and Integration tests using XUnit, Moq and FluentAssertions. Implemented CI/CD pipelines for automated deployments.',
            imageUrl: 'https://placehold.co/600x400/0f172a/67e8f9?text=WEB+API+Project',
            githubUrl: 'https://github.com/maynoralex/Restaurants'
            //liveDemoUrl: 'https://your-microservices-demo.com',
        },
        {
            id: 2,
            title: 'GraphQL API with C#',
            description: 'Built a C# GraphQL simple API by using GraphQL.NET library. The API allows users to query and mutate restaurants data using GraphQL syntax, providing a flexible and efficient way to interact with the backend.',
            imageUrl: 'https://placehold.co/600x400/0f172a/67e8f9?text=GraphQL+.NET+Project',
            githubUrl: 'https://github.com/maynoralex/GraphQLProject'
            //liveDemoUrl: 'https://your-data-tool-demo.com',
        },
        {
            id: 3,
            title: 'CRWN React Web APP',
            description: 'Developed an online shop using React',
            imageUrl: 'https://placehold.co/600x400/0f172a/67e8f9?text=React+App',
            githubUrl: 'https://github.com/maynoralex/crw-clothing',
            liveDemoUrl: 'https://jolly-souffle-2e9c19.netlify.app'
        },
    ];

    // --- Function to render Skills ---
    function renderSkills() {
        const skillsGrid = document.getElementById('skills-grid');
        if (!skillsGrid) return;
        skillsGrid.innerHTML = ''; // Clear existing content

        skillsData.forEach(skill => {
            const skillDiv = document.createElement('div');
            skillDiv.className = 'skill-card';
            // Use Font Awesome <i> tag for icons
            skillDiv.innerHTML = `
                <span class="skill-icon">
                    <i class="${skill.iconClass}"></i>
                </span>
                <h3 class="skill-name">${skill.name}</h3>
            `;
            skillsGrid.appendChild(skillDiv);
        });
    }

    // --- Function to enhance project description using Gemini API ---
    async function enhanceDescription(projectId) {
        const projectIndex = projectsData.findIndex(p => p.id === projectId);
        if (projectIndex === -1) return;

        const project = projectsData[projectIndex];
        
        // Find the button and description element for this project
        const projectCard = document.querySelector(`.project-card[data-project-id="${projectId}"]`);
        const enhanceButton = projectCard ? projectCard.querySelector('.btn-enhance') : null;
        const descriptionParagraph = projectCard ? projectCard.querySelector('.project-description') : null;

        if (!enhanceButton || !descriptionParagraph) return;

        // Store original button content for reset
        const originalButtonHtml = enhanceButton.innerHTML;

        // Set loading state
        enhanceButton.disabled = true;
        enhanceButton.innerHTML = `
            <svg class="spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Enhancing...
        `;

        try {
            const prompt = `Given the project title '${project.title}' and its current description '${project.description}', generate a more detailed and professional description, expanding on the technical aspects and impact. Make it suitable for a software engineer's portfolio. Keep it concise, around 3-4 sentences.`;

            let chatHistory = [];
            chatHistory.push({ role: "user", parts: [{ text: prompt }] });
            const payload = { contents: chatHistory };
            const apiKey = ""; // If you want to use models other than gemini-2.0-flash or imagen-3.0-generate-002, provide an API key here. Otherwise, leave this as-is.
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                const text = result.candidates[0].content.parts[0].text;
                // Update the description in the data array
                projectsData[projectIndex].description = text;
                // Update the DOM
                descriptionParagraph.textContent = text;
            } else {
                console.error("Gemini API response structure unexpected:", result);
                descriptionParagraph.textContent = "Failed to enhance description. Please try again.";
            }
        } catch (error) {
            console.error("Error enhancing description:", error);
            descriptionParagraph.textContent = "An error occurred while enhancing description.";
        } finally {
            // Reset loading state
            enhanceButton.disabled = false;
            // Using a plain "Enhance Description ✨" text for simplicity after loading
            // If you want a static icon here, you'd put '<i class="fas fa-magic"></i> Enhance Description'
            enhanceButton.innerHTML = originalButtonHtml; // Restore original HTML content
        }
    }

    // --- Function to render Projects ---
    function renderProjects() {
        const projectsGrid = document.getElementById('projects-grid');
        if (!projectsGrid) return;
        projectsGrid.innerHTML = ''; // Clear existing content

        projectsData.forEach(project => {
            const projectDiv = document.createElement('div');
            projectDiv.className = 'project-card';
            projectDiv.setAttribute('data-project-id', project.id);

            projectDiv.innerHTML = `
                <img
                    src="${project.imageUrl}"
                    alt="${project.title} Thumbnail"
                    class="project-image"
                    onerror="this.onerror=null;this.src='https://placehold.co/600x400/0f172a/67e8f9?text=Image+Error';"
                />
                <div class="project-content">
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-description">${project.description}</p>
                    <div class="project-actions">
                        <a
                            href="${project.githubUrl}"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="action-button btn-primary"
                        >
                            <i class="fab fa-github"></i> View Code
                        </a>
                        ${
                            project.liveDemoUrl
                                ? `<a
                                    href="${project.liveDemoUrl}"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="action-button btn-secondary"
                                >
                                    <i class="fas fa-external-link-alt"></i> Live Demo
                                </a>`
                                : ''
                        }
                    </div>
                </div>
            `;
            projectsGrid.appendChild(projectDiv);

            
        });
    }

    // Initial render calls
    renderSkills();
    renderProjects();
});
