document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const downloadButtons = document.querySelectorAll('.btn-download');
    if (downloadButtons.length === 0) return;

    function escapeHtml(value) {
        return String(value).replace(/[&<>'"]/g, (character) => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        })[character]);
    }

    function collectCvData() {
        const skills = [...document.querySelectorAll('.skill-item')].map((item) => {
            const name = item.querySelector('.skill-name')?.textContent.trim() ?? '';
            const rawValue = item.querySelector('.progress-bar-fill')?.dataset.width ?? '0%';
            const value = /^\d{1,3}%$/.test(rawValue) ? rawValue : '0%';
            return { name: escapeHtml(name), value };
        }).filter((skill) => skill.name);

        const services = [...document.querySelectorAll('.service-card')].map((card) => ({
            name: escapeHtml(card.querySelector('.service-name')?.textContent.trim() ?? ''),
            description: escapeHtml(card.querySelector('.service-description')?.textContent.trim() ?? '')
        })).filter((service) => service.name);

        const projects = [...document.querySelectorAll('.project-card')].map((card) => ({
            title: escapeHtml(card.querySelector('.project-title')?.textContent.trim() ?? ''),
            category: escapeHtml(card.querySelector('.project-category')?.textContent.trim() ?? '')
        })).filter((project, index, items) => (
            project.title && items.findIndex((item) => item.title === project.title) === index
        ));

        return {
            name: escapeHtml(document.querySelector('.hero-name')?.textContent.trim() ?? 'Mariam Sajaia'),
            title: escapeHtml(document.querySelector('.hero-title')?.textContent.replace(/\s+/g, ' ').trim() ?? 'Frontend Developer'),
            bio: escapeHtml(document.querySelector('.about-text')?.textContent.trim() ?? ''),
            skills,
            services,
            projects
        };
    }

    function createCvMarkup(data) {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.name} - Resume Preview</title>
    <style>
        :root {
            --paper: #F3EFE6;
            --paper-deep: #E6DED0;
            --ink: #18201E;
            --ink-soft: #4E5752;
            --brick: #984936;
            --moss: #66705D;
            --line: #CFC5B5;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { background: #262B29; }
        body {
            min-height: 100vh;
            padding: 32px 18px 56px;
            background:
                linear-gradient(rgba(255, 255, 255, 0.018) 1px, transparent 1px),
                #262B29;
            background-size: 100% 24px;
            color: var(--ink);
            font-family: 'Segoe UI', Arial, Helvetica, sans-serif;
            line-height: 1.55;
        }
        button { font: inherit; }
        button:focus-visible { outline: 2px solid #D8A58F; outline-offset: 4px; }
        .action-bar,
        .cv-paper { width: min(920px, 100%); margin-inline: auto; }
        .action-bar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 20px;
            margin-bottom: 18px;
            padding: 10px 2px;
            color: #E8E2D8;
        }
        .toolbar-title,
        .toolbar-actions { display: flex; align-items: center; gap: 10px; }
        .toolbar-title {
            color: #C9C2B7;
            font-size: 12px;
            font-weight: 600;
            letter-spacing: 0.12em;
            text-transform: uppercase;
        }
        .toolbar-button {
            min-height: 38px;
            padding: 8px 15px;
            border: 1px solid #737A76;
            border-radius: 2px;
            background: transparent;
            color: #E8E2D8;
            cursor: pointer;
            transition: background 160ms ease, border-color 160ms ease, color 160ms ease;
        }
        .toolbar-button.primary {
            border-color: #B96850;
            background: #984936;
            color: #FFF9F0;
            font-weight: 600;
        }
        .toolbar-button:hover { border-color: #E8E2D8; background: rgba(255, 255, 255, 0.06); }
        .toolbar-button.primary:hover { border-color: #C37B64; background: #7F3B2D; }
        .cv-paper {
            position: relative;
            display: grid;
            grid-template-columns: minmax(190px, 0.72fr) minmax(0, 1.55fr);
            gap: 28px 48px;
            padding: 58px 64px 62px;
            overflow: hidden;
            border: 1px solid rgba(255, 255, 255, 0.28);
            border-radius: 3px;
            background: var(--paper);
            box-shadow: 0 24px 70px rgba(0, 0, 0, 0.3);
        }
        .cv-paper::before {
            position: absolute;
            top: 0;
            left: 0;
            width: 9px;
            height: 100%;
            background: var(--brick);
            content: '';
        }
        .cv-header {
            position: relative;
            grid-column: 1 / -1;
            margin-bottom: 4px;
            padding: 0 0 28px 104px;
            border-bottom: 1px solid var(--line);
        }
        .cv-header::before {
            position: absolute;
            top: 2px;
            left: 0;
            color: var(--brick);
            font-family: 'Segoe UI', Arial, Helvetica, sans-serif;
            font-size: 55px;
            font-weight: 700;
            line-height: 1;
            content: 'MS';
            letter-spacing: -0.08em;
        }
        .cv-name {
            color: var(--ink);
            font-family: 'Segoe UI', Arial, Helvetica, sans-serif;
            font-size: clamp(38px, 6vw, 58px);
            font-weight: 700;
            letter-spacing: -0.025em;
            line-height: 0.98;
        }
        .cv-title {
            margin-top: 10px;
            color: var(--brick);
            font-size: 15px;
            font-weight: 600;
            letter-spacing: 0.16em;
            text-transform: uppercase;
        }
        .cv-contact-info {
            display: flex;
            flex-wrap: wrap;
            gap: 7px 19px;
            margin-top: 17px;
            color: var(--ink-soft);
            font-size: 12px;
            font-weight: 600;
            letter-spacing: 0.08em;
            text-transform: uppercase;
        }
        .cv-contact-info span:not(:last-child)::after {
            margin-left: 19px;
            color: var(--brick);
            content: '/';
        }
        .cv-section { min-width: 0; }
        .cv-section:first-of-type {
            grid-column: 1 / -1;
            padding-bottom: 28px;
            border-bottom: 1px solid var(--line);
        }
        .cv-section:nth-of-type(2) {
            grid-column: 1;
            grid-row: span 2;
            padding-right: 30px;
            border-right: 1px solid var(--line);
        }
        .cv-section:nth-of-type(3),
        .cv-section:nth-of-type(4) { grid-column: 2; }
        .section-title {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 16px;
            color: var(--moss);
            font-size: 12px;
            font-weight: 600;
            letter-spacing: 0.17em;
            text-transform: uppercase;
        }
        .section-title::before {
            width: 19px;
            height: 1px;
            background: var(--brick);
            content: '';
        }
        .cv-bio {
            max-width: 760px;
            color: #35403A;
            font-family: 'Segoe UI', Arial, Helvetica, sans-serif;
            font-size: 15.5px;
            font-weight: 400;
            line-height: 1.72;
        }
        .skills-grid { display: grid; grid-template-columns: 1fr; gap: 20px; }
        .list-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0 25px; }
        .skill-info {
            display: flex;
            justify-content: space-between;
            gap: 12px;
            margin-bottom: 7px;
            color: var(--ink);
            font-size: 12.5px;
            font-weight: 600;
        }
        .skill-info span:last-child { color: var(--brick); font-variant-numeric: tabular-nums; }
        .bar-track { height: 3px; overflow: hidden; background: var(--paper-deep); }
        .bar-fill { height: 100%; background: var(--moss); }
        .list-card {
            min-width: 0;
            padding: 13px 0 14px;
            border-top: 1px solid var(--line);
        }
        .list-card h3 {
            color: var(--ink);
            font-family: 'Segoe UI', Arial, Helvetica, sans-serif;
            font-size: 14px;
            font-weight: 600;
            line-height: 1.35;
        }
        .list-card p { margin-top: 5px; color: #3F4944; font-size: 12.5px; line-height: 1.6; }
        @media (max-width: 720px) {
            body { padding: 14px 10px 30px; }
            .action-bar { align-items: flex-start; flex-direction: column; padding: 6px 0; }
            .toolbar-title,
            .toolbar-actions { flex-wrap: wrap; }
            .cv-paper {
                display: block;
                padding: 38px 27px 44px 34px;
            }
            .cv-header { padding: 0 0 24px; }
            .cv-header::before { position: static; display: block; margin-bottom: 20px; font-size: 38px; }
            .cv-section { margin-top: 28px; }
            .cv-section:first-of-type { padding-bottom: 26px; }
            .cv-section:nth-of-type(2) { padding-right: 0; border-right: 0; }
            .list-grid { grid-template-columns: 1fr; }
            .cv-contact-info { display: grid; gap: 5px; }
            .cv-contact-info span::after { display: none; }
        }
        @media print {
            @page { size: A4; margin: 12mm; }
            html,
            body { background: #FFFFFF; }
            body { min-height: auto; padding: 0; }
            .action-bar { display: none; }
            .cv-paper {
                width: 100%;
                max-width: none;
                padding: 9mm 10mm 10mm 13mm;
                border: 0;
                box-shadow: none;
            }
            .cv-paper::before { width: 2.5mm; }
            .cv-name { font-size: 38px; }
            .cv-bio { font-size: 10.5pt; line-height: 1.6; }
            .list-card { break-inside: avoid; }
        }
    </style>
</head>
<body>
    <div class="action-bar">
        <div class="toolbar-title">
            <span>${data.name} &bull; Resume Preview</span>
        </div>
        <div class="toolbar-actions">
            <button class="toolbar-button" id="closePreview" type="button">Close</button>
            <button class="toolbar-button primary" id="printPreview" type="button">Download / Print PDF</button>
        </div>
    </div>

    <main class="cv-paper">
        <header class="cv-header">
            <h1 class="cv-name">${data.name}</h1>
            <p class="cv-title">${data.title}</p>
            <div class="cv-contact-info">
                <span>Frontend Development</span>
                <span>Responsive Web Design</span>
                <span>Digital Marketing</span>
            </div>
        </header>

        <section class="cv-section">
            <h2 class="section-title">Profile</h2>
            <p class="cv-bio">${data.bio || 'Dedicated developer creating modern digital experiences.'}</p>
        </section>

        <section class="cv-section">
            <h2 class="section-title">Expertise</h2>
            <div class="skills-grid">
                ${data.skills.map((skill) => `
                    <div>
                        <div class="skill-info"><span>${skill.name}</span><span>${skill.value}</span></div>
                        <div class="bar-track"><div class="bar-fill" style="width: ${skill.value}"></div></div>
                    </div>
                `).join('')}
            </div>
        </section>

        <section class="cv-section">
            <h2 class="section-title">Capabilities</h2>
            <div class="list-grid">
                ${data.services.map((service) => `
                    <article class="list-card"><h3>${service.name}</h3><p>${service.description}</p></article>
                `).join('')}
            </div>
        </section>

        <section class="cv-section">
            <h2 class="section-title">Selected Work</h2>
            <div class="list-grid">
                ${data.projects.map((project) => `
                    <article class="list-card"><h3>${project.title}</h3><p>${project.category}</p></article>
                `).join('')}
            </div>
        </section>
    </main>

    <script>
        document.getElementById('closePreview').addEventListener('click', () => window.close());
        document.getElementById('printPreview').addEventListener('click', () => window.print());
    <\/script>
</body>
</html>`;
    }

    function openCvPreview(event) {
        event.preventDefault();

        const cvBlob = new Blob([createCvMarkup(collectCvData())], {
            type: 'text/html;charset=utf-8'
        });
        const previewUrl = URL.createObjectURL(cvBlob);
        const previewWindow = window.open(previewUrl, '_blank');

        if (previewWindow) {
            previewWindow.opener = null;
            window.setTimeout(() => URL.revokeObjectURL(previewUrl), 60000);
        } else {
            URL.revokeObjectURL(previewUrl);
            window.location.href = event.currentTarget.href;
        }
    }

    downloadButtons.forEach((button) => button.addEventListener('click', openCvPreview));
});
