import React from "react";
import "../styles/notfound.css";

function NotFoundPage() {
	return (
		<section className="page_404">
			<div className="notfound-container">
				<div className="row">
					<div className="col-sm-12">
						<div className="col-sm-10 col-sm-offset-1 text-center">
							<div className="four_zero_four_bg">
								<h1 className="text-center">404</h1>
							</div>
							<div className="content_box_404">
								<h3 className="h3">Looks like you're lost</h3>
								<p>The page you are looking for is not available!</p>
								<a href="/homepage" className="link_404">
									Go to Home
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

export default NotFoundPage;
