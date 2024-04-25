import React from "react";
import "../styles/compliance.css";

const ComplianceDocument = () => {
	return (
		<div className="compliance-document">
			<h1>Compliance Document for Secure Teams Software</h1>
			<p>
				<strong>Version 3.0 | Last Updated: 17th April 2024</strong>
			</p>

			<h2>Table of Contents:</h2>
			<ol>
				<li>
					<a href="#introduction">Introduction</a>
				</li>
				<li>
					<a href="#legal-regulatory">Legal and Regulatory Framework</a>
				</li>
				<li>
					<a href="#policies-procedures">Policies and Procedures</a>
				</li>
				<li>
					<a href="#controls-safeguards">Controls and Safeguards</a>
				</li>
				<li>
					<a href="#training-awareness">Training and Awareness</a>
				</li>
				<li>
					<a href="#monitoring-auditing">Monitoring and Auditing</a>
				</li>
				<li>
					<a href="#documentation-updates">Documentation Updates</a>
				</li>
				<li>
					<a href="#references">References</a>
				</li>
				<li>
					<a href="#contact-information">Contact Information</a>
				</li>
			</ol>

			<h2 id="introduction">1. Introduction:</h2>
			<p>
				Secure Teams is a software application designed to facilitate secure
				communication and collaboration among team members within organizations.
				This compliance document outlines the policies, procedures, and controls
				implemented to ensure compliance with relevant laws, regulations, and
				industry standards regarding data security, privacy, and
				confidentiality.
			</p>

			<h2 id="legal-regulatory">2. Legal and Regulatory Framework:</h2>
			<p>
				Secure Teams operates in accordance with main features of data
				protection and privacy laws, such as those mentioned in:
			</p>
			<ul>
				<h3>General Data Protection Regulation (GDPR):</h3>
				<ul>
					<li>
						Scope: GDPR applies to the processing of personal data, which
						includes any information relating to an identified or identifiable
						natural person ('data subject'). This includes direct identifiers
						(such as name and email address).{" "}
					</li>
					<li>
						Data Subject Rights: GDPR grants individuals several rights
						regarding their personal data, including the right to access their
						data, the right to rectify inaccurate data, the right to erasure and
						the right to restrict processing.
					</li>
					<li>
						Lawful Basis for Processing: The company must have a lawful basis
						for processing personal data. This could include obtaining explicit
						consent from the data subject, processing necessary for the
						performance of a contract, compliance with legal obligations,
						protection of vital interests, performance of a task carried out in
						the public interest or in the exercise of official authority, and
						legitimate interests pursued by the data controller or a third
						party.
					</li>
					<li>
						Data Protection Principles: GDPR establishes several principles for
						the processing of personal data, including lawfulness, fairness, and
						transparency; purpose limitation; data minimization; accuracy;
						storage limitation; integrity and confidentiality (security); and
						accountability.
					</li>
					<li>
						Data Breach Notification: GDPR mandates organizations to notify
						relevant supervisory authorities of data breaches within 72 hours of
						becoming aware of the breach, unless the breach is unlikely to
						result in a risk to the rights and freedoms of individuals.
					</li>
				</ul>
			</ul>

			<h2 id="policies-procedures">3. Policies and Procedures:</h2>
			<p>
				Secure Teams adheres to the following comprehensive set of policies and
				procedures to ensure the security and integrity of user data:
			</p>
			<ul>
				<h3>Data Privacy Policy:</h3>
				<ul>
					<li>
						The Data Privacy Policy outlines how Secure Teams collects,
						processes, stores, and protects user data.
					</li>
					<li>
						It specifies the types of data collected, the purposes for which it
						is collected, and the lawful basis for processing.
					</li>
					<li>
						The policy details procedures for obtaining user consent, handling
						data subject requests, and ensuring compliance with data protection
						regulations such as GDPR.
					</li>
					<li>
						Secure Teams is committed to transparency regarding data practices
						and provides clear information to users about their privacy rights
						and how their data is used.
					</li>
				</ul>
				<h3>Data Security Policy:</h3>
				<ul>
					<li>
						The Data Security Policy defines the measures and protocols
						implemented to safeguard user data against unauthorized access,
						disclosure, alteration, or destruction.
					</li>
					<li>
						It outlines security controls such as encryption, access controls,
						authentication mechanisms, and network security measures.
					</li>
					<li>
						Secure Teams employs industry-standard security practices to protect
						data both in transit and at rest.
					</li>
					<li>
						The policy includes provisions for regular security assessments,
						vulnerability management, and incident response to proactively
						address security threats and vulnerabilities.
					</li>
				</ul>
				<h3>User Access Control Policy:</h3>
				<ul>
					<li>
						The User Access Control Policy governs the management of user access
						rights and privileges within the Secure Teams platform.
					</li>
					<li>
						It defines roles and permissions for different user categories based
						on job roles, responsibilities, and organizational requirements.
					</li>
					<li>
						Secure Teams follows the principle of least privilege, ensuring that
						users have access only to the resources and functionalities
						necessary to perform their duties.
					</li>
					<li>
						The policy includes procedures for user authentication, account
						provisioning, deprovisioning, and periodic access reviews to
						maintain the integrity of access control mechanisms.
					</li>
				</ul>
				<h3>Incident Response Plan:</h3>
				<ul>
					<li>
						The Incident Response Plan outlines procedures for detecting,
						responding to, and recovering from security incidents and data
						breaches.
					</li>
					<li>
						It establishes a clear chain of command, roles, and responsibilities
						for incident response team members.
					</li>
					<li>
						Secure Teams maintains a structured incident response process,
						including incident identification and classification e.g
						notification alerts to admin on multiple wrong password attempts and
						being logged out of the account.
					</li>
				</ul>
				<p>
					These policies and procedures form the foundation of Secure Teams'
					commitment to protecting user data, ensuring privacy and
					confidentiality, and maintaining regulatory compliance. They are
					regularly reviewed, updated, and communicated to all stakeholders to
					ensure ongoing effectiveness and adherence to best practices in data
					governance and security.
				</p>
			</ul>

			<h2 id="controls-safeguards">4. Controls and Safeguards:</h2>
			<p>
				To ensure the security and confidentiality of user data, Secure Teams
				implements the following controls and safeguards:
			</p>
			<ul>
				<h3>Password Policy Enhancement:</h3>
				<li>
					If three consecutive wrong passwords are entered, the user is
					automatically logged out.
				</li>
				<li>
					An alert is sent to the admin notifying them of suspicious activity.
				</li>
				<li>
					A notification is sent to the admin's secondary email address,
					informing them of the suspicious activity.
				</li>
			</ul>
			<ul>
				<h3>Existing Controls:</h3>
				<li>End-to-end encryption for all communication channels</li>
				<li>Multi-factor authentication (MFA) </li>
				<li>Role-based access control (RBAC)</li>
				<li>Regular security assessments</li>
			</ul>

			<h2 id="training-awareness">5. Training and Awareness:</h2>
			<p>
				Secure Teams provides regular training sessions and awareness programs
				to educate employees and users about data security best practices,
				including:
			</p>
			<li>Security awareness training modules</li>
			<li>User guidelines for secure communication</li>
			<li>Reporting procedures for security incidents</li>

			<h2 id="monitoring-auditing">6. Monitoring and Auditing:</h2>
			<p>
				Secure Teams conducts regular monitoring and auditing activities to:
			</p>
			<li>Monitor user activity and access logs</li>
			<li>Detect and investigate security incidents</li>
			<li>Review compliance with policies and procedures</li>

			<h2 id="documentation-updates">7. Documentation Updates:</h2>
			<p>
				This compliance document will be reviewed and updated annually or as
				needed to reflect changes in regulations, industry standards, or
				organizational policies.
			</p>

			<h2 id="references">8. References:</h2>
			<a href="https://gdpr.eu/">GDPR Portal</a>

			<h2 id="contact-information">9. Contact Information:</h2>
			<p>
				For questions or concerns regarding this compliance document, please
				contact:
			</p>
			<h4>Admin Secure Teams</h4>
			<p>
				Email: 
				<a href="mailto:secureeteams@gmail.com"> secureeteams@gmail.com</a>
			</p>
			<p>
				Phone:
				<a href="tel:+923242756548">+92 (324) 2756548</a>
			</p>

			<p>
				This compliance document serves as a comprehensive guide to the security
				measures and compliance practices implemented by Secure Teams to
				safeguard user data and ensure regulatory compliance.
			</p>
		</div>
	);
};

export default ComplianceDocument;
