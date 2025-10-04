# Local Quickstart

Install [`git`](https://git-scm.com/). See [Install Git](INSTALLATION.md#install-git).

Open a terminal, clone this repository, and change directory to the repository root:

```sh
$ git clone https://github.com/Public-Environmental-Data-Partners/j40-cejst-2.git
Cloning into 'j40-cejst-2'...
$ cd j40-cejst-2
```

Install [`docker`](https://docs.docker.com/get-docker/). See [Install Docker](INSTALLATION.md#install-docker).

> _Important_: To be able to run the entire application, you may need to increase the memory allocated for docker to at least 8096 MB. See [this post](https://stackoverflow.com/a/44533437) for more details.

Use [`docker compose`](https://docs.docker.com/compose/) to run the full application:

```sh
$ PIPELINE_CMD="data_pipeline.application full-run" docker compose up
```
The above command will build and spin up three containers: A data pipeline container, a data server, and a web server. 

The data pipeline container can run the entire data pipeline, or any individual step. Because running the entire pipeline is a time-consuming process, the application command has been turned into a variable so individual parts of the pipeline can be run by docker compose. Once the full-run has been completed, you can change the PIPELINE_CMD environment variable to any other valid parameter for future runs. For example setting `PIPELINE_CMD="data_pipeline.application full-run --help"` would show the options for the full-run command. This would be helpful if you didn't want to run the data pipeline but merely wanted to see front end changes.

The data server will make the files created by the data pipeline container available to the web server. The data pipeline container mounts the local repo directories to read and write files. The data server presents the local files to the webserver to render the map and downloadable files.

The web server will run the application website. After it initializes, you should be able to open the web server in your browser at [`http://localhost:8000`](http://localhost:8000). If the data pipeline container is set to run the full data pipeline, the website will not pick up the changes until the pipeline completes.

In order for docker to pick up code changes, the images will need to be rebuilt. If there are code changes in the data folder, the data pipeline image should be rebuilt. If there are code changes in the the client folder, the web server image should be rebuilt. The data server image should never have to be rebuilt.

Command to rebuild the data pipeline image:

```sh
$ docker build ./data/data-pipeline -t 'j40_data_pipeline'
```

Command to rebuild the web server image:

```sh
$ docker build ./client -t 'j40_website'
```

Once one or both images are rebuilt, you can re-run the docker compose command.