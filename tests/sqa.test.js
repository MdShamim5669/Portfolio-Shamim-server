import { authService } from '../src/services/authService.js';
import { courseService } from '../src/services/courseService.js';
import { experienceService } from '../src/services/experienceService.js';
import { profileService } from '../src/services/profileService.js';
import { projectService } from '../src/services/projectService.js';
import { skillService } from '../src/services/skillService.js';
import { thesisService } from '../src/services/thesisService.js';

async function runSQATestSuite() {
  console.log('🧪 Starting SQA End-to-End Test Suite...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`  ✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${testName}`);
      failed++;
    }
  }

  try {
    // Test 1: Profile Service
    const profile = await profileService.getProfile();
    assert(profile && profile.fullName === 'Md. Samim', 'Profile Data Integrity Check (fullName === "Md. Samim")');
    assert(profile && profile.cgpa === 3.55, 'Profile Data Integrity Check (cgpa === 3.55)');

    // Test 2: Skill Service
    const skills = await skillService.getAllSkills();
    assert(Array.isArray(skills) && skills.length >= 36, `Skill Count Audit (Expected >= 36, Found ${skills.length})`);
    const languages = skills.filter((s) => s.category === 'LANGUAGES');
    assert(languages.length >= 5, `Languages Skill Category Check (Found ${languages.length})`);

    // Test 3: Project Service
    const projects = await projectService.getAllProjects();
    assert(Array.isArray(projects) && projects.length >= 2, `Projects Count Audit (Expected >= 2, Found ${projects.length})`);
    const safus = projects.find((p) => p.title.includes('SaFus'));
    assert(safus && safus.techStack.includes('MongoDB'), 'Project Tech Stack Integrity Check (SaFus Restaurant)');

    // Test 4: Thesis Service
    const thesis = await thesisService.getThesis();
    assert(thesis && thesis.accuracy === 84.4, 'Thesis Accuracy Metric Audit (accuracy === 84.4%)');
    assert(thesis && thesis.modelName.includes('Random Forest'), 'Thesis Model Name Check (Random Forest)');

    // Test 5: Experience Service
    const experiences = await experienceService.getAllExperiences();
    assert(Array.isArray(experiences) && experiences.length >= 1, 'Experience Records Audit');

    // Test 6: Course Service
    const courses = await courseService.getAllCourses();
    assert(Array.isArray(courses) && courses.length >= 5, `Udemy Courses Audit (Expected 5, Found ${courses.length})`);

    // Test 7: Auth Service Authentication Test
    try {
      const authResult = await authService.login('tamjidulislamsamim@gmail.com', 'samim5669');
      assert(authResult && authResult.token, 'Admin Authentication & JWT Generation Test');
    } catch (e) {
      assert(false, `Admin Authentication Test Failed: ${e.message}`);
    }

    // Test 8: Security Check - Negative Login Test
    try {
      await authService.login('tamjidulislamsamim@gmail.com', 'WRONG_PASSWORD_123');
      assert(false, 'Security Audit: Invalid password allowed access!');
    } catch (e) {
      assert(e.statusCode === 401, 'Security Audit: Invalid password correctly rejected (401 Unauthorized)');
    }

  } catch (error) {
    console.error('❌ SQA Execution Error:', error);
  } finally {
    console.log(`\n📊 SQA Test Execution Summary: ${passed} Passed, ${failed} Failed out of ${passed + failed} Tests.`);
    process.exit(failed > 0 ? 1 : 0);
  }
}

runSQATestSuite();
