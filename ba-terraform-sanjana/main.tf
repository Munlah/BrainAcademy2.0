terraform {
  required_providers {
    azurerm = {
      source = "hashicorp/azurerm"
    }
  }
}

provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "dvopsBrainAcademy" {
  name     = "dvopsBrainAcademy"
  location = "East US"
}

resource "azurerm_kubernetes_cluster" "dvopsAKSCluster" {
  name                = "dvopsAKSCluster"
  location            = azurerm_resource_group.dvopsBrainAcademy.location
  resource_group_name = azurerm_resource_group.dvopsBrainAcademy.name
  dns_prefix          = "brainacademy-aks"

  default_node_pool {
    name       = "default"
    node_count = 1
    vm_size    = "Standard_DS2_v2"
  }

  service_principal {
    client_id     = "05de0227-985d-4dab-8a7e-b0fea47ad7bb"
    client_secret = "T6I8Q~3ly863P7qAVeWbN7zZe~hmPV_HmcrQvdkZ"
  }
}