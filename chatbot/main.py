import os 
from dotenv import load_dotenv
from  agents import Agent, Runner,RunConfig, AsyncOpenAI, OpenAIChatCompletionsModel, RunContextWrapper, function_tool

from fastapi import FastAPI
from  contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware



load_dotenv()


def setup_config():
    # Set up the OpenAI API key
    gemini_api_key = os.getenv("GEMINI_API_KEY")
    if not gemini_api_key:
        raise ValueError("OPENAI_API_KEY environment variable not set.")

    print("Gemini API Key:", gemini_api_key)
    
    external_client = AsyncOpenAI(
        api_key=gemini_api_key,
        base_url="https://generativelanguage.googleapis.com/v1beta/openai/",
    )

    model = OpenAIChatCompletionsModel(
        model="gemini-1.5-flash",
        openai_client=external_client,       
    )

    # Set up the model configuration
    config = RunConfig(
        model=model,
        model_provider=external_client,
        tracing_disabled=True,
    )



    @function_tool
    def developer_detail_agent_func(context: RunContextWrapper):
        # This function will be called when the agent is invoked
        # You can access the context and perform any necessary actions here
        return (f"""
                    Developer Details:
                    Name: Maaz Ahmed
                    Role: Software Developer
                    Experience: 5+ years
                    Location: Pakistan
                
                    I'm a Software Developer with 5+ years of experience crafting innovative solutions across various technologies. Currently, my passion lies in cloud-native development, building robust and scalable backend systems. While my expertise has expanded to include cutting-edge technologies like Generative AI, I also possess a strong foundation in full-stack development, bringing experience in both front-end and back-end technologies. My key skills include:
                    - Cloud Platforms: Azure
                    - Microservices Architecture
                    - Event-Driven Architecture
                    - Backend Development: Python, Node.js, Express 
                    - Generative AI: Eager to explore how this technology can be integrated into future projects.
                    - Databases: MongoDB, MySQL, PostgreSQL
                    - Containerization:Docker
                    - Frontend Development: Next.js, React.js
                    
                    Summary:
                        I'm a Software Developer with 5+ years of experience crafting
                        innovative solutions across various technologies. Currently, my
                        passion lies in cloud-native development, building robust and
                        scalable backend systems. While my expertise has expanded to
                        include cutting-edge technologies like Generative AI, I also possess a
                        strong foundation in full-stack development, bringing experience in
                        both front-end and back-end technologies. My key skills include:- Cloud Platforms: Azure- Microservices Architecture- Event-Driven Architecture- Backend Development: Python, Node.js, Express- Generative AI: Eager to explore how this technology can be
                        integrated into future
                        projects.- Databases: MongoDB, MySQL, PostgreSQL- Containerization:Docker- Frontend Developm



                    skills include:
                        Top Skills
                        Frontend:
                        React.js
                        React Native
                        Next.js
                        Redux.js
                        HTML
                        CSS
                        Tailwind CSS
                        JavaScript
                        Backend
                        Python
                        FastAPI
                        Apache Kafka
                        Kong API Gateway
                        Docker
                        Node.js
                        Express.js
                        MongoDB
                        Firebase
                        SQLModel
                        Pydantic
                        pytest
                        Cloud and Infrastructure
                        Docker
                        Apache Kafka
                        Kong API Gateway
                        Firebase
                        Cloud Computing
                        Development Methodologies
                        Microservices
                        Event-drive
                    
                    """
                
       
        )

    @function_tool
    def project_detail_agent_func(context: RunContextWrapper):
        return(
            f"""
                Here are the extracted project details from the provided task description:

                **Project Title:** Basic User Login & QR Code Generator

                **Estimated Time:** 3–5 days

                **Objective:**  
                Develop a small full-stack, cross-platform application (web, iOS, Android) with user registration, login, and QR code generation features.

                **Features:**  
                1. **User Registration & Login**  
                - Simple form with email and password fields.  
                - Backend authentication using simulated session/token logic.  

                2. **Dashboard Page (Post-Login)**  
                - Display a welcome message including the user’s email.  
                - Generate and display a unique QR code based on the user’s email or user ID.  

                3. **Data Storage**  
                - Store user data securely in a simple database (SQL or NoSQL) via backend API calls.  

                4. **System Design**  
                - Provide a System Architecture Diagram.  
                - Provide a Data Flow Diagram.  

                5. **Code Quality**  
                - Ensure clean, well-documented code.  

                **Bonus (Optional):**  
                - Implement mobile responsiveness or develop a basic mobile app interface using React Native or Flutter.  
                - Integrate an open-source, small, context-aware ML/AI model or LLM to generate a user-specific sentence based on:  
                - User’s email.  
                - Account creation date.  
                - QR code.  
                *Example Output:* “The user’s name is John Doe. This name is very common to represent an anonymous person.”

                **Tech Stack:**  
                - Candidate’s choice (e.g., React + Node.js, Flutter + Firebase, React Native, etc.).

                **Deliverables:**  
                - GitHub repository link containing the source code.  
                - A brief README file with setup instructions.

                **Additional Notes:**  
                - Initiate the project at the earliest convenience and ensure timely delivery.  
                - Contact Team Sustainable Pathfinders for any questions.
            """
        )


    triage_agent = Agent(
        name="Triage_Agent",
        instructions=(
            # f"""You are a triage agent. You use the tools given to you to triage
            #  Your task is to triage the user message and call the relevant tools in order
            #  User Can ask you to get Revlevant information about the developer
            #  Yser Ask about the developer Must tell User name and role of the developer
            #  User Can ask you to get Revlevant information about the project
            #  User Ask about the project Must tell User project title and estimated time"
            #  Do not answer any other question
            #  Do Not Mix the information of developer and project
            #  If user ask about developer and project at the same time then provide the information of developer first and then project
            #  must use paragraphs  to format the output
            #  use developer_detail_agent_functo get the information about the developer.
            #  provoide  Summary if asked about the developer
            #  provide Top Skills if asked about the developer
            #  provide detail if asked about the developer
             
            #  """
#             f"""
#                 Triage Agent Instructions

#                 You are a triage agent tasked with assisting users by providing specific information about a developer and a project. Use the tools available to you to retrieve and deliver accurate responses based on the user's query. Follow these guidelines:

#                 1. Purpose
#                 Your primary role is to triage user queries and provide relevant information about a developer or a project, as requested.
#                 2. Handling Developer Queries
#                 When the user asks about the developer, you must include the developer's name and role in your response.
#                 If the user requests a summary, provide a brief summary of the developer.
#                 If the user asks for top skills, list the developer's top skills.
#                 If the user seeks detailed information, provide a comprehensive overview of the developer.
#                 Tool Usage: Use the developer_detail_agent_func tool to retrieve all information about the developer.
#                 3. Handling Project Queries
#                 When the user asks about the project, you must provide the project's title and estimated time.
#                 4. Handling Combined Queries
#                 If the user asks about both the developer and the project in the same query, present the developer's information first, followed by the project's information.
#                 5. Restrictions
#                 Do not respond to any questions unrelated to the developer or the project.
#                 Do not combine or mix the information about the developer and the project in your response.
#                 6. Formatting
#                 Use paragraphs to structure your output, ensuring it is clear and readable.
#                 Key Guidelines
#                 Only provide the information explicitly requested by the user.
#                 If the user does not specify the level of detail for the developer (e.g., summary, top skills, or detailed information), default to providing the developer's name and role.
#                 For project queries, always include the title and estimated time unless otherwise specified.
# """

                f"""
                You’re a triage agent helping users with developer and project info. Use your tools to answer accurately based on the query.

                1. **Query Types**  
                - **Developer queries**: Look for "developer," "name," "role," "skills," "summary."  
                - **Project queries**: Look for "project," "title," "time."  
                - **Combined queries**: Check for both (e.g., "developer and project").  
                - If it’s unrelated, don’t respond.

                2. **Developer Queries**  
                - Default: Give only the name and role.  
                - If "summary," "skills," or "details" is mentioned, add those from the tool’s output.  
                - Use `developer_detail_agent_func` and extract just what’s needed.

                3. **Project Queries**  
                - Always give the title and estimated time using the project tool.

                4. **Combined Queries**  
                - Write developer info first (per query detail), then project info in a new paragraph.

                5. **Rules**  
                - Don’t mix developer and project info in one paragraph.  
                - Ignore queries not about developer or project.
                """
             

            


           

        ),
        model=model,
        tools=[
            developer_detail_agent_func,
            project_detail_agent_func
        ],
        
    )

    return triage_agent, config








@asynccontextmanager
async def lifespan(app: FastAPI):
    print(f"""
    --------------------------------------------
    ======== | Welcome to FastAPI | ========  
        
                PORT    :        8000
                ---------------------
                HOST    :   localhost
                ---------------------
                ENV     :         DEV
                ---------------------
                STATUS  :     WORKING
        
            URL => http://localhost:8000 
    --------------------------------------------
    """)
    yield

from pydantic import BaseModel
class Body(BaseModel):
    message: str


app:FastAPI =  FastAPI(lifespan=lifespan, title="FastAPI Neon Todo API", version="2.0.0", servers=[
     {
        "url": "http://localhost:8000",
        "description": "Local server"
    }
])

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001","http://localhost:3001"],  # Specify your frontend's origin
    allow_methods=["*"],                      # Allow all HTTP methods
    allow_headers=["*"],                      # Allow all headers
)





@app.post("/")
async def read_root(data: Body):
    triage_agent, config = setup_config()
    result = await Runner.run(triage_agent, input=data.message, run_config=config)
    print(result.final_output,"===")
    # return {"Hello": "World", "message":"Welcome to FastAPI", "result": result.final_output , "msg":data.message}

    if not result.final_output:
        return {
            "msg":{
                "message":"No output generated",
                "role":"bot"
            }
        }
    
    return {
        "suscess": True,
        "status": 200,
        "msg":{
            "message":result.final_output,
            "role":"bot"
        }
    }

# uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000
# To start the project 

#     Run Server
#           cd stp-server
#            npm i or yarn
#            npm Statr

#     Run Clisnt
#           cd stp-client
#            npm i or yarn
#            npm Statr

#     Run chatbot
     
#            install uv (pakege manget)
#            cd chatbot 
#            run command uv installl
#           run project => uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000
  